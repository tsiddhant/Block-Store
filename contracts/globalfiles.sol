pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract GlobalFiles{
    struct globalfiles{
         string ipfshash;
         address user;
         string filetype;
    }
    globalfiles[] filearray;

    mapping(address=>address) public Certification;  //first address for user account address and second address is the certificate contract deployed address of that user

    struct globalrequest{
        string msgg;
        address user;
    }

    globalrequest[] globalrequests;

    function addinfilearray(string ipfsha, address user, string ftype) public{
         globalfiles memory newfile = globalfiles({
            ipfshash:ipfsha,
            user:user,
            filetype : ftype
        });
        filearray.push(newfile);

    }

    function createcertify(address addr) public{
         address newCertify = new Certificate(addr);

        Certification[addr] = newCertify;

    }

    function getfilearray() public view returns(string[],address[],string[]){

         string[] memory ipfs = new string[](filearray.length);
         address[] memory user = new address[](filearray.length);
         string[] memory ftype=new string[](filearray.length);
         for (uint i = 0; i < filearray.length; i++) {
             ipfs[i] = filearray[i].ipfshash;
             user[i] = filearray[i].user;
             ftype[i]=filearray[i].filetype;
         }
         return (ipfs,user,ftype);
    }

    function addinglobalrequests(string msgg) public{
         globalrequest memory newrequest = globalrequest({
            msgg:msgg,
            user:msg.sender
        });
        globalrequests.push(newrequest);

    }
    function getglobalrequests() public view returns(string[],address[]){

         string[] memory msgg = new string[](globalrequests.length);
         address[] memory user = new address[](globalrequests.length);
         for (uint i = 0; i < globalrequests.length; i++) {
             msgg[i] = globalrequests[i].msgg;
             user[i] = globalrequests[i].user;

         }
         return (msgg,user);
    }
}

contract Certificate{

    address public useraddr;
    struct certificates{
        address certifier;
        string msgg;
        string date;
    }

    certificates[] certiarray;
    certificates[] allrequests;

     modifier isuser()
    {
        require(useraddr==msg.sender);
        _;
    }

    function Certificate(address useraddr) public {
        useraddr = useraddr;
    }

     function getcertificates() public view returns(address[],string[],string[]){

         address[] memory certifier = new address[](certiarray.length);
         string[] memory msgg = new string[](certiarray.length);
         string[] memory date = new string[](certiarray.length);

         for (uint i = 0; i < certiarray.length; i++) {
             certifier[i] = certiarray[i].certifier;
             msgg[i] = certiarray[i].msgg;
             date[i] = certiarray[i].date;
         }
         return (certifier,msgg,date);
    }

    function addcertificates(string msgg, string date) public{
         certificates memory newcertificate = certificates({
            certifier: msg.sender,
            msgg:msgg,
            date:date
        });
        allrequests.push(newcertificate);
    }

    function getallcertirequests() public view isuser returns(address[], string[], string[])
    {
         address[] memory certifier = new address[](certiarray.length);
         string[] memory msgg = new string[](certiarray.length);
         string[] memory date = new string[](certiarray.length);

         for (uint i = 0; i < certiarray.length; i++) {
             certifier[i] = certiarray[i].certifier;
             msgg[i] = certiarray[i].msgg;
             date[i] = certiarray[i].date;
         }
         return (certifier,msgg,date);
    }



    function acceptcertificate(uint i) public isuser
    {
        certiarray.push(allrequests[i]);
        for(uint j=i;j<allrequests.length-1;j++)
        {
            allrequests[j]=allrequests[j+1];

        }
        allrequests.length--;
    }

    function rejectcertificate(uint i) public isuser
    {

        for(uint j=i;j<allrequests.length-1;j++)
        {
            allrequests[j]=allrequests[j+1];

        }
        allrequests.length--;

    }

}
