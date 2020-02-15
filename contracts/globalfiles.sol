pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract GlobalFiles{
    struct globalfiles{
         string ipfshash;
         address user;
         string filetype;
    }
    globalfiles[] filearray;

    struct globalrequest{
        string msg;
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
            msg:msgg,
            user:msg.sender
        });
        globalrequests.push(newrequest);
       
    }
    function getglobalrequests() public view returns(string[],address[]){

         string[] memory msg = new string[](globalrequests.length);
         address[] memory user = new address[](globalrequests.length);
         for (uint i = 0; i < globalrequests.length; i++) {
             msg[i] = globalrequests[i].msg;
             user[i] = globalrequests[i].user;
             
         }
         return (msg,user);
    }
}