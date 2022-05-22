import { LightningElement, api, wire, track } from 'lwc';
// import findRecords from "@salesforce/apex/SalesforcePocClass.getAllRecords";
import getOppRecords from "@salesforce/apex/SalesforcePocClass.getOppRecords";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Opportunity_OBJECT from '@salesforce/schema/Opportunity';
import StageName_FIELD from '@salesforce/schema/Opportunity.StageName';

const columns =[{
        label: 'Opportunity name',
        fieldName: 'oppName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Description',
        fieldName: 'oppDesc',
        type: 'text',
        sortable: true
    },
    {
        label: 'Close Data',
        fieldName: 'oppCloseDate',
        type: 'Date',
        sortable: true
    },
    {
        label: 'Account Name',
        fieldName: 'accName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Contact Name',
        fieldName: 'conName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Contact Email',
        fieldName: 'conMail',
        type: 'email',
        sortable: true
    },
    {
        label: 'Contact Phone',
        fieldName: 'conPhone',
        type: 'text',
        sortable: true
    }
    ];

export default class SalesforcePoc extends LightningElement {

    // Retrieve the opportunity metadata(objectInfo)
    @wire(getObjectInfo, { objectApiName: Opportunity_OBJECT })
    opportunityMetadata;

    // retriving the StageName picklist values of Opportunity

    @wire(getPicklistValues,
        {
            recordTypeId: '$opportunityMetadata.data.defaultRecordTypeId',
            fieldApiName: StageName_FIELD
        }
    )   
    
    // parsing the picklist value and adding a new value dynamically and assigning values to another reactive property
    OpportunityPicklist({data, error}){
        if(data) {
            var listViewData = [];
            var obj = data.values.length ? data.values:[];
            for(var i = 0; i<obj.length; i++){
                listViewData.push({
                    attributes:null,
                    label:obj[i].label,
                    validFor:Array(0),
                    value:obj[i].value
                })
            }
            listViewData.unshift({
                attributes:null,
                    label:"--Any--",
                    validFor:Array(0),
                    value: ""
            })
            this.oppStages = listViewData;
        } else if(error) {
            this.error = error;
        }
    }

    stagevalue;
    accValue;
    conValue;
    stageNameValue = '';
    showFooter;
    limitRecs = 1000;
    @track oppStages = [];
    @track error;
    @track columns = columns;
    @track sortBy;
    @track sortDirection;

    // This method handles search box field values and calls apex method to retrieve custom wrapper data
    handleFilterChange(event) {
        const value = event.target.value;
        if (event.target.name === "oppStage") {
            this.stagevalue = value;
        }
        if (event.target.name === "account") {
            this.accValue = value;
        }
        if (event.target.name === "contact") {
            this.conValue = value;
        }
        if (event.target.name === "numRecs") {
            this.numOfRec = value;
        }
        
        getOppRecords({
            StageName: this.stagevalue, AccountName: this.accValue, ContactName: this.conValue, limitNum:this.limitRecs})
            .then((data) => {  
                this.items = data;
                this.totalRecountCount = data.length; //here it is 23
                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
                
                //initial data to be displayed ----------->
                //slice will take 0th element and ends with 5, but it doesn't include 5th element
                //so 0 to 4th rows will be displayed in the table
                this.data = this.items.slice(0,this.pageSize); 
                this.endingRecord = this.pageSize;
                this.columns = columns;
                this.showFooter = this.totalRecountCount > 0 ? true : false;
                this.error = undefined;
            })
            .catch((error) => {
                this.showFooter = true;
                this.error = error;
                this.opportunities = undefined;
            });
    }

    // Pagination start

    @track page = 1; //this will initialize 1st page
    @track items = []; //it contains all the records.
    @track data = []; //data to be displayed in the table
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 5; //default value we are assigning
    @track totalRecountCount = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    displayRecordPerPage(page){

        /*let's say for 2nd page, it will be => "Displaying 6 to 10 of 23 records. Page 2 of 5"
        page = 2; pageSize = 5; startingRecord = 5, endingRecord = 10
        so, slice(5,10) will give 5th to 9th records.
        */
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        //increment by 1 to display the startingRecord count, 
        //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
        this.startingRecord = this.startingRecord + 1;
    }

    // Pagination end

        // Column sorting start

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.opportunities));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.opportunities = parseData;
    }  

     // Column sorting end
}