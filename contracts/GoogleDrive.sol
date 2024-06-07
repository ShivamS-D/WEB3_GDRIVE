// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract GoogleDrive {
    struct Image{
        string image;
        uint256 id;
    }
    mapping(address => Image[]) public  images;
    mapping(address => mapping(address => bool)) public  accessPermissions;
    mapping(address=>address[]) public  accessedPeoples;
    mapping (address=>address[]) public accessBy;
    mapping(address=>Image[]) public buyedImages;
    event ImageUploaded(address indexed user, string url);
    event AccessGranted(address indexed from, address indexed to);

    address[]  public  uploadedPersons;
    function uploadImages(address addr,string memory url) public {
        if(images[addr].length==0){
        uploadedPersons.push(addr);

        }
        uint256 id=images[msg.sender].length+1;
        Image memory img=Image(url,id);
       
        images[addr].push(img);
        emit ImageUploaded(addr, url);
       
    }

    function getWhoHasUploaded() public view returns(address[] memory){
        return uploadedPersons;
    }


    function giveAccess(address addr) public {
        require(accessPermissions[msg.sender][addr]==false,"already access");
        accessPermissions[msg.sender][addr] = true;
        accessedPeoples[msg.sender].push(addr);
        accessBy[addr].push(msg.sender);
        emit AccessGranted(msg.sender, addr);
    }
    function buyAccess(address from) public payable  {
        require(msg.value>=0.0000001 ether,"Not sufficient balance");

        require(accessPermissions[from][msg.sender]==false,"already accessed");
        accessPermissions[from][msg.sender]=true;
        accessedPeoples[from].push(msg.sender);
        accessBy[msg.sender].push(from);
        emit AccessGranted(from,msg.sender);

    }
    function buyImages(address addr,uint256 _id) public payable {
        require(msg.value>=0.0000001 ether,"Not sufficient balance");
        require(images[addr].length>0 && _id<images[addr].length && _id>=0);
        buyedImages[msg.sender].push(images[addr][_id]);
    }
    function getBuyedImages(address addr) public view returns (Image[] memory){
        return buyedImages[addr];
    }

    function revokeAccess(address addr) public {
        require(accessPermissions[msg.sender][addr]==true,"Already not accessed");
        accessPermissions[msg.sender][addr] = false;
        uint256 idx;
        for(uint256 i=0; i<accessedPeoples[msg.sender].length; i++){
            if(accessedPeoples[msg.sender][i]==addr){
                idx=i;
            }
        }
        for(uint256 i=idx; i<accessedPeoples[msg.sender].length-1; i++){
            address  temp=accessedPeoples[msg.sender][i];
            accessedPeoples[msg.sender][i]=accessedPeoples[msg.sender][i+1];
            accessedPeoples[msg.sender][i+1]=temp;
        }
        accessedPeoples[msg.sender].pop();
        address[] storage accessers=accessBy[addr];
        for(uint256 i=0; i<accessers.length; i++){
            if(accessers[i]==msg.sender){
                for(uint256 j=i; j<accessers.length-1; j++){
                    address temp=accessers[i+1];
                    accessers[i+1]=accessers[i];
                    accessers[i]=temp;
                }
                break ;
            }
        }
        accessers.pop();
    }

    function getAccessedImages(address from) public view returns (Image[] memory) {
        require(from==msg.sender || accessPermissions[from][msg.sender]==true, "Access not granted");
        return images[from];
    }
    function getAccessedUser() public view returns (address[] memory){
       return  accessedPeoples[msg.sender];

    }
    function getAccessedBy(address addr) public view returns (address[] memory){
        return accessBy[addr];
    }

}
