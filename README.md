# A repository containing various POCs in Salesforce

POC 1, Problem statement:

Display Opportunity, Account and Contact Details
Instructions :
1. Choose either AURA or LWC as per your choice
2. Test Class is nice to have
3. Please ensure that the code that you have written is project deployable ready. 
4. Please ensure relevant information like what settings are required for the assignment to
work. 
5. We advise you to make assumptions if anything is not clear, however please clearly
state any assumptions you would have made upfront in the beginning of the interview.

Scenario:
The customer wants to have the ability to search for opportunities and contacts in a custom
manner. As part of the search table, the customer expects the below fields:
1. Opportunity Name (Text)
2. Opportunity Description  (Text)
3. Opportunity Close Date (Date)
4. Associated Account Name  (Text)
5. Name of most Recent Contact associated to Opportunity’s Account (Text)
6. Contact Email of most Recent created Contact associated to Opportunity’s Account
(Text)
7. Contact Number of most Recent created Contact associated to Opportunity’s Account
(Phone Number)

The customer is expecting the following functionality:
> Create a Search box at top of the table to search through the Opportunity Stage,
Account Name or Contact Name and filter result on basis of input value.
> If there is any record which is not visible to the user then the contents of the same
should be masked with just the first three characters viewable to the end users.

Solution: A LWC to fetch Opportunities along with it's Account Name and it's associated most recent Contact details

Here's a screen recording of the Search, filters and DataTable features:
<video src='https://user-images.githubusercontent.com/35221111/169682614-4ebce9fa-8b1f-4d7d-b64e-b05ca2e51778.mp4' width=180/>

Components involved and their functionality

SalesforcePoc LWC - Parent component which takes input from User in the Form of Opportunity Stage, Account Name or Contact Name. It then makes an apex imperative call to fetch Opportunity's Name, description, Close Date and it's Parent Account's Name, along with these details, apex class also fetches the most recent contact's Name, Email and Phone, of the parent account, and returns a List of Wrapper Objects containing the aforementioned details.

DataTableCmp LWC - Child of SalesforcePoc component, which is used to display the wrapper records.

Paginator LWC - Child of SalesforcePoc component, which is used to perform pagination on List of records received.

# Want to deploy this project to your Org?
Fell free to do so by using this button:
<a href="https://githubsfdeploy.herokuapp.com?owner=ksamudrala3&repo=SalesforcePOCs&ref=SalesforcePoc">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png" target="_blank">
</a>

Alternatively you may also use this link to install an unlocked package in your org: https://login.salesforce.com/packaging/installPackage.apexp?p0=04t2x000004Nw42AAC
