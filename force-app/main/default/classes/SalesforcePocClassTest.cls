@isTest
public class SalesforcePocClassTest {
    
    @TestSetup
    static void setupTestData(){
        Account a = new Account(Name='Test');
        Insert a;
        Opportunity o = new Opportunity(
            AccountId=a.Id, Description='Test',Name='Test',CloseDate=System.today(), StageName='Closed Won');
        Contact c = new Contact(LastName='Test', Email='test@test.com',Phone='1234567890',AccountId=a.Id);
        insert o;
        insert c;
    }
    static testMethod void testgetOppRecords(){
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Custom: Support Profile'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
                          EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
                          LocaleSidKey='en_US', ProfileId = p.Id,
                          TimeZoneSidKey='America/Los_Angeles',
                          UserName=uniqueUserName);
        Opportunity o = [Select StageName from Opportunity LIMIT 1];
        Contact c = [Select id, Name from Contact LIMIT 1];
        Account a = [Select id, Name from Account LIMIT 1];
        System.runAs(u){
            Test.startTest();
            List<SalesforcePocClass.wrapperObject> wrapList = SalesforcePocClass.getOppRecords(o.stageName, a.Name,c.Name);
            Test.stopTest();
            System.assertEquals(1, wrapList.size());
        }       
    }    	
}