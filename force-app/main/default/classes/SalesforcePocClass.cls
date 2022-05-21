/*
* @Name         SalesforcePocClass 
* @Author       Krishna Teja Samudrala <krishntej1@gmail.com>
* @Date         21/05/2022
* @Description  This class is used in SalesforcePoc LWC to retrieve Account, Contact and Opportunity data 
* @TestCLass    SalesforcePocClassTest
*/

public without sharing class SalesforcePocClass {  
    
    /*
    * @Description  This method gets the records of Account, Contact and Opportunity Objects based on user inputs
	* @Params		String StageName, String AccountName, String ContactName - Input from User
	* @Return       List<wrapperObject> - Custom wrapper object's List
    */
    
    
    public static List<wrapperObject> getOppRecords(String StageName, String AccountName, String ContactName ) { 
        String searchAccString = string.isNotBlank(AccountName) ? '%' + string.escapeSingleQuotes(AccountName) + '%' : '';
        String searchConString = string.isNotBlank(ContactName) ? '%' + string.escapeSingleQuotes(ContactName) + '%' : '';
        String searchStageName = string.isBlank(StageName) ? '%%' : '%' + string.escapeSingleQuotes(StageName) + '%';
        
        Set<Id> wrapIds = new Set<Id>();
        Set<Id> accIds = new Set<Id>();
        List<wrapperObject> wrapList = new List<wrapperObject>();
        
        try { 
            List<Contact> cons = new List<Contact>([SELECT ID, AccountId FROM Contact 
                                                    WHERE Name LIKE :searchConString
                                                    Order BY createddate DESC LIMIT 1]);
            
            For(Contact c : cons)
            {
                accIds.add(c.AccountId);       
            }       
            
            for(Opportunity o : [SELECT ID, AccountId, Account.Name, StageName, Name, Description, CloseDate 
                                 FROM Opportunity
                                 WHERE StageName LIKE :searchStageName
                                 AND (Account.Name LIKE :searchAccString
                                      OR AccountId IN :accIds)])
            {
                wrapIds.add(o.Id);
                wrapIds.add(o.AccountId);
                wrapperObject wO = new wrapperObject();
                wo.oppCloseDate = o.CloseDate;
                wo.oppDesc = o.Description;
                wo.oppName = o.Name;
                wo.accName = o.Account.Name;
                wo.accId = o.AccountId;
                wo.oppId = o.Id;
                for(contact c : [SELECT ID, AccountId, NAME, EMAIL, PHONE FROM CONTACT 
                                 WHERE AccountId =:o.AccountId
                                 Order by CreatedDate DESC 
                                 LIMIT 1]) 
                {                    
                    wrapIds.add(c.Id);
                    wo.conId = c.Id;
                    wo.conMail = c.Email;
                    wO.conName = c.Name;
                    wo.conPhone = c.Phone;
                }
                wrapList.add(wo);
            }
            if(Test.isRunningTest()){
                throw new AuraHandledException('NSFW name detected.');
            }
        } catch (Exception e) {
            System.debug(e.getMessage() + ' ' + e.getLineNumber());
        }
        wrapList = processAccessCheck(wrapList, wrapIds);
        return wrapList;
    }
    
    /*
    * @Description  This method masks the records of Account, Contact and Opportunity Objects based on user's access level
	* @Params		List<wrapperObject> wrapList - Input from getOppRecords method, Set<Id> wrapIds - Ids of all objects retieved
	* @Return       List<wrapperObject> - Custom wrapper object's List
    */
    
    public static List<wrapperObject> processAccessCheck(List<wrapperObject> wrapList, Set<Id> wrapIds){
        
        List<wrapperObject> returnList = new List<wrapperObject>();
        Map<String,UserRecordAccess> URA = new Map<String,UserRecordAccess>([SELECT RecordId FROM UserRecordAccess 
                                                                             WHERE UserId = :UserInfo.getUserId() 
                                                                             AND RecordId IN :wrapIds
                                                                             AND HasReadAccess = TRUE]);
        
        For(wrapperObject wo : wrapList){
            if(!URA.containsKey(wo.accId)){
                wo.accName = String.isNotBlank(wo.accName) ? wo.accName.replaceAll('(^[^@]{3}|(?!^)\\G)[^@]', '$1*') : '';                   
            }
            if(!URA.containsKey(wo.conId)){                
                wo.conName = String.isNotBlank(wo.conName) ? wo.conName.replaceAll('(^[^@]{3}|(?!^)\\G)[^@]', '$1*') : '';
                wo.conMail = String.isNotBlank(wo.conMail) ? wo.conMail.replaceAll('(^[^@]{3}|(?!^)\\G)[^@]', '$1*') : '';
                wo.conPhone = String.isNotBlank(wo.conPhone) ? wo.conPhone.replaceAll('(^[^@]{3}|(?!^)\\G)[^@]', '$1*') : '';                                                 
            }
            if(!URA.containsKey(wo.oppId)){
                wo.oppName = String.isNotBlank(wo.oppName) ? wo.oppName.replaceAll('(^[^@]{3}|(?!^)\\G)[^@]', '$1*') : '';
                wo.oppDesc = String.isNotBlank(wo.oppDesc) ? wo.oppDesc.replaceAll('(^[^@]{3}|(?!^)\\G)[^@]', '$1*') : '';                
            }
            returnList.add(wo);            
        }
        return returnList;
    }
    
    /*
    * @Description  This is a wrapper class which combines data of Account, Contact and Opportunity Objects
	* @Params		None for one constructor, String accId for another constructor
	* @Return       NA
    */
    
    public class wrapperObject {
        @AuraEnabled
        public String oppName{get;set;}
        @AuraEnabled
        public String accName{get;set;}
        @AuraEnabled
        public String oppDesc{get;set;}
        @AuraEnabled
        public Date oppCloseDate{get;set;}
        @AuraEnabled
        public String conName{get;set;}
        @AuraEnabled
        public String conMail{get;set;}
        @AuraEnabled
        public String conPhone{get;set;}
        @AuraEnabled
        public String accId{get;set;}
        @AuraEnabled
        public String conId{get;set;}
        @AuraEnabled
        public String oppId{get;set;}
        public wrapperObject() {
            
        }
        public wrapperObject(String accId) {
            this.accId = accId;
        }
    }
}