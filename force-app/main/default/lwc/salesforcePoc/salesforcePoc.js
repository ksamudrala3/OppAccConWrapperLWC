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
    stageNameValue;
    showFooter;
    numRecoptions = [{ label: 5, value: 5 },
    { label: 10, value: 10 },
        { label: 50, value: 50 }];
    numOfRec = 5;
    @track oppStages = [];
    @track error;
    @track opportunities = [];
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
            StageName: this.stagevalue, AccountName: this.accValue, ContactName: this.conValue, limitNum:this.numOfRec})
            .then((result) => {                
                this.opportunities = result;
                this.showFooter = this.opportunities.length > 0 ? true : false;
                this.error = undefined;
            })
            .catch((error) => {
                this.showFooter = true;
                this.error = error;
                this.opportunities = undefined;
            });
    }

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
}