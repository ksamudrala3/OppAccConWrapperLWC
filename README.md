# A repository containing various POCs in Salesforce

POC 1, Problem statement:

![Problem statement](https://user-images.githubusercontent.com/35221111/171987053-102af18a-8c1e-43d6-ba83-b171467dadf7.jpeg)

A LWC to fetch Opportunities along with it's Account Name and it's associated most recent Contact details

Here's a screen recording of the Search, filters and DataTable features:
<video src='https://user-images.githubusercontent.com/35221111/169682614-4ebce9fa-8b1f-4d7d-b64e-b05ca2e51778.mp4' width=180/>

Components involved and their functionality

SalesforcePoc LWC - Parent component which takes input from User in the Form of Opportunity Stage, Account Name or Contact Name. It then makes an apex imperative call to fetch Opportunity's Name, description, Close Date and it's Parent Account's Name, along with these details, apex class also fetches the most recent contact's Name, Email and Phone, of the parent account, and returns a List of Wrapper Objects containing the aforementioned details.

DataTableCmp LWC - Child of SalesforcePoc component, which is used to display the wrapper records.

Paginator LWC - Child of SalesforcePoc component, which is used to perform pagination on List of records received.

# Want to deploy this project to your Org?
Fell free to do so by using the following button.
<a href="https://githubsfdeploy.herokuapp.com?owner=ksamudrala3&repo=SalesforcePOCs&ref=SalesforcePoc">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

Alternatively you may also use this link to install an unlocked package in your org: https://login.salesforce.com/packaging/installPackage.apexp?p0=04t2x000004Nw42AAC
