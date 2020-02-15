pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract BlockStore{
    address[] users;
    address[] projects;
    mapping(address=>address) public userdetails;  // left address for user account address right address is for where the user contract is deployed
    mapping(address => address) public projectdetails;// left address for projectcontract right is projectleader address
    address owner;
    modifier isowner(){
        require(msg.sender==owner);
        _;
    }
    function BlockStore() public{
        owner=msg.sender;
    }
    function createUser(string usr, string nm,string pubkey, string privkey) public{
        require(userdetails[msg.sender]==0);
        address newUser = new UserAccount(msg.sender,usr,nm,pubkey,privkey);
        users.push(msg.sender);
        userdetails[msg.sender]=newUser;
    }

    function getUsers() public view returns(address[]){
        return users;
    }

    function addproject(address project, address teamleader) public {
        projects.push(project);
        projectdetails[project]=teamleader;
    }

}

contract FolderTree {

    bytes32 public treeRoot;

     struct NodeStruct{
        bool isFile;
        bool isNode;
        bytes32 parent; // the id of the parent node
        uint parentIndex; //  the position of this node in the Parent's children list
        bytes32[] children; // unordered list of children below this node
        string ipfshash;
        string name;
        string aespass;
        // more node attributes here
    }

    mapping(bytes32 => NodeStruct) public nodeStructs;

    event LogNewNode(address sender, bytes32 nodeId, bytes32 parentId);
    event LogDelNode(address sender, bytes32 nodeId);

    function FolderTree() {
        treeRoot = newNode(0,"","root","");
    }

    function isNode(bytes32 nodeId)
        public
        constant
        returns(bool isIndeed)
    {
        return nodeStructs[nodeId].isNode;
    }

    function newNode(bytes32 parent, string ipfshs, string nm,string pass)
        public
        returns(bytes32 newNodeId)
    {
        if(!isNode(parent) && parent > 0) throw; // zero is a new root node
        newNodeId = sha3(parent, msg.sender, block.number);
        NodeStruct memory node;
        node.parent = parent;
        node.isNode = true;
        if(keccak256(ipfshs) == keccak256(""))
        {
            node.isFile=false;
        }
        else
        {
            node.isFile=true;
        }
        node.ipfshash=ipfshs;
        node.aespass=pass;
        node.name=nm;
        // more node atributes here
        if(parent>0) {
            node.parentIndex = registerChild(parent,newNodeId);
        }
        nodeStructs[newNodeId] = node;
        LogNewNode(msg.sender, newNodeId, parent);
        return newNodeId;
    }


    function registerChild(bytes32 parentId, bytes32 childId)
        private
        returns(uint index)
    {
        return nodeStructs[parentId].children.push(childId) - 1;
    }


    function pruneBranch(bytes32 nodeId)
        public
        returns(bool success)
    {
        bytes32 parent = nodeStructs[nodeId].parent;
        uint rowToDelete = nodeStructs[nodeId].parentIndex;
        uint rowToMove = nodeStructs[parent].children.length-1; // last child in the list
        nodeStructs[parent].children[rowToDelete] = nodeStructs[parent].children[rowToMove];
        nodeStructs[nodeStructs[parent].children[rowToMove]].parentIndex = rowToMove;
        nodeStructs[parent].children.length--;
        nodeStructs[nodeId].parent=0;
        nodeStructs[nodeId].parentIndex=0;
        nodeStructs[nodeId].isNode = false;
        LogDelNode(msg.sender, nodeId);
        return true;
    }

    function getNodeChildCount(bytes32 nodeId)
        public
        constant
        returns(uint childCount)
    {
        return(nodeStructs[nodeId].children.length);
    }

    function getNodeChildAtIndex(bytes32 nodeId, uint index)
        public
        constant
        returns(bytes32 childId)
    {
        return nodeStructs[nodeId].children[index];
    }

}





contract UserAccount is FolderTree{

    struct projectdetails{
        address project;
        string name;
    }

    struct sharestruct{
        string file;
        string aespass;
        string name;
        address user;
    }

    string privatekey;
    string public publickey;
    address public userAdd;
    string public name;
    string public username;

    projectdetails[] userprojects;
    sharestruct[] sendfiles;
    sharestruct[] receivedfiles;
    BlockStore mainblock;
    Project projectobj;

    projectdetails[] allrequests;




    modifier isuser()
    {
        require(userAdd==msg.sender);
        _;
    }

    function UserAccount(address addr,string usr, string nm, string pubkey,string privkey)public{
            userAdd = addr;
            username = usr;
            name = nm;
            publickey = pubkey;
            privatekey = privkey;
    }

    function getprivatekey() public view isuser returns(string)
    {
        return privatekey;
    }

    function getuserprojects() public view isuser returns(address[], string[])
    {

        address[] memory addrs = new address[](userprojects.length);
        string[] memory pname = new string[](userprojects.length);

        for (uint i = 0; i < userprojects.length; i++) {
            addrs[i] = userprojects[i].project;
            pname[i] = userprojects[i].name;
        }
        return (addrs,pname);
    }


    function getproject(uint i) public view isuser returns(address, string)
    {
        return (userprojects[i].project, userprojects[i].name);
    }

    function getuserfiles(bytes32 parent) public view isuser returns(bytes32[], bool[], string[])
    {
        uint childcount=getNodeChildCount(parent);
        bool[] memory isFiles = new bool[](childcount);
        string[] memory fnames = new string[](childcount);
        bytes32[] memory childaddr = new bytes32[](childcount);
        for(uint i=0;i<childcount;++i)
        {

            childaddr[i] = getNodeChildAtIndex(parent, i);
            isFiles[i] =  nodeStructs[childaddr[i]].isFile;
            fnames[i] = nodeStructs[childaddr[i]].name;
        }
        return (childaddr,isFiles,fnames);
    }


    function getsendfiles() public view isuser returns(string[], string[], string[], address[])
    {

        string[] memory file = new string[](sendfiles.length);
        string[] memory aespass = new string[](sendfiles.length);
        string[] memory name = new string[](sendfiles.length);
        address[] memory user = new address[](sendfiles.length);

        for(uint i=0;i<sendfiles.length;++i)
        {
            file[i]=sendfiles[i].file;
            aespass[i]=sendfiles[i].aespass;
            name[i]=sendfiles[i].name;
            user[i]=sendfiles[i].user;
        }
        return (file,aespass,name, user);
    }


    function addsendfile(string file,string aespass,string nm, address user) isuser public
    {

        sharestruct memory newsend = sharestruct({
            file:file,
            aespass:aespass,
            name : nm,
            user:user
        });
        sendfiles.push(newsend);
    }

    function addreceivedfile(string file,string aespass,string nm, address user) public
    {

        sharestruct memory newreceived = sharestruct({
            file:file,
            aespass:aespass,
            name : nm,
            user:user
        });
        receivedfiles.push(newreceived);
    }

    function getreceivedfiles() public view isuser returns(string[], string[], string[], address[])
    {

        string[] memory file = new string[](receivedfiles.length);
        string[] memory aespass = new string[](receivedfiles.length);
        string[] memory name = new string[](receivedfiles.length);
        address[] memory user = new address[](receivedfiles.length);

        for(uint i=0;i<receivedfiles.length;++i)
        {
            file[i]=receivedfiles[i].file;
            aespass[i]=receivedfiles[i].aespass;
            name[i]=receivedfiles[i].name;
            user[i]=receivedfiles[i].user;
        }
        return (file,aespass,name, user);
    }


    function addfile(bytes32 parent, string ipfsaddr,string nm, string aeskey) public isuser {
        newNode(parent, ipfsaddr,  nm, aeskey);
    }



    function getallrequests() public view isuser returns(address[], string[])
    {
        address[] memory addrs = new address[](allrequests.length);
        string[] memory pname = new string[](allrequests.length);

        for (uint i = 0; i < allrequests.length; i++) {
            addrs[i] = allrequests[i].project;
            pname[i] = allrequests[i].name;
        }

        return (addrs,pname);
    }

    function acceptrequest(uint i) public isuser
    {
        projectobj=Project(allrequests[i].project);
        projectobj.addteammate(userAdd);
        userprojects.push(allrequests[i]);
        for(uint j=i;j<allrequests.length-1;j++)
        {
            allrequests[j]=allrequests[j+1];

        }
        allrequests.length--;

    }

    function rejectrequest(uint i) public isuser
    {

        for(uint j=i;j<allrequests.length-1;j++)
        {
            allrequests[j]=allrequests[j+1];

        }
        allrequests.length--;

    }

    function addrequest(address addr,string nam) public
    {

        projectdetails memory newrequest = projectdetails({
            project : addr,
            name : nam
        });
        allrequests.push(newrequest);
    }

    function createproject(string projectname, address mainaddr, string pubkey,string privkey) public isuser
    {

        mainblock=BlockStore(mainaddr);
        address newProject = new Project(projectname,msg.sender, pubkey, privkey);
        projectdetails memory newprojectdetails = projectdetails({
            project : newProject,
            name : projectname
        });
        userprojects.push(newprojectdetails);
        mainblock.addproject(newProject, msg.sender);

    }

}
contract Project is FolderTree{
    string public name;
    address[] teammates;
    string publickey;
    string privatekey;

    mapping (bytes32=>address) public fileuploader;

    struct chatdetails{
        string msg;
        address useraddr;
    }

    chatdetails[] chats;

    modifier ismember()
    {
        uint f=0;
        for(uint j=0;j<teammates.length;j++)
        {
            if(teammates[j]==msg.sender)
            {
                f=1;
                break;
            }

        }
        require(f==1);
        _;
    }

    modifier isnotmember()
    {
        uint f=0;
        for(uint j=0;j<teammates.length;j++)
        {
            if(teammates[j]==msg.sender)
            {
                f=1;
                break;
            }

        }
        require(f==0);
        _;
    }

    function Project(string nm, address addr, string pubkey,string privkey) public{
        name=nm;
        teammates.push(addr);
        publickey = pubkey;
        privatekey = privkey;
    }

    function getpublickey() public view ismember returns(string)
    {
        return publickey;
    }

    function getprivatekey() public view ismember returns(string)
    {
        return privatekey;
    }
    function getteammates() public view ismember returns(address[])
    {
        return teammates;
    }

    function addteammate(address addr) public isnotmember
    {
        teammates.push(addr);
    }

    function addfile(bytes32 parent, string ipfsaddr,string nm, string aeskey) public ismember {
        newNode(parent, ipfsaddr, nm, aeskey);
        bytes32 childaddr = nodeStructs[parent].children[nodeStructs[parent].children.length-1];
        fileuploader[childaddr] = msg.sender;
    }

    function getprojectfiles(bytes32 parent) public view ismember returns(bytes32[], bool[], string[])
    {
        uint childcount=getNodeChildCount(parent);
        bool[] memory isFiles = new bool[](childcount);
        string[] memory fnames = new string[](childcount);
        bytes32[] memory childaddr = new bytes32[](childcount);
        for(uint i=0;i<childcount;++i)
        {

            childaddr[i] = getNodeChildAtIndex(parent, i);
            isFiles[i] =  nodeStructs[childaddr[i]].isFile;
            fnames[i] = nodeStructs[childaddr[i]].name;
        }
        return (childaddr,isFiles,fnames);
    }

    function addprojectchat(string message) public ismember
    {
        chatdetails memory newchat = chatdetails({
            msg : message,
            useraddr : msg.sender
        });
        chats.push(newchat);
    }

    function getprojectchats() public view ismember returns(string[], address[])
    {
        string[] memory msg = new string[](chats.length);
        address[] memory useraddr = new address[](chats.length);
        for(uint i=0;i<chats.length;++i)
        {
            msg[i] = chats[i].msg;
            useraddr[i] = chats[i].useraddr;
        }
        return (msg,useraddr);
    }

}