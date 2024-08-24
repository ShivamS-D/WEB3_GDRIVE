<!-- # Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
``` -->


# Welcome to decentralized images drive

## Blockchain used - Ethereum

## contract address - > 0xbc36127b0406da2bdb6139d5094071543ed13994
## deployed on sepolia test net
## To check the verified contract visit sepolia.etherscan.io and put this contract address

# Contract Structure
1. Structs
> Image: Represents an image uploaded by a user.
> image: The URL of the image.
> id: A unique identifier for the image.

2. Mappings
> images: Maps a user’s address to an array of Image structs. This stores all the images uploaded by each user.
> accessPermissions: Maps an address pair (from -> to) to a boolean value indicating whether to has access to from's images.
> accessedPeoples: Maps a user's address to an array of addresses that have been granted access by that user.
> accessBy: Maps a user's address to an array of addresses that have granted access to that user.
> buyedImages: Maps a user's address to an array of Image structs that the user has purchased access to.
3. Events
> ImageUploaded(address indexed user, string url): Emitted when a user uploads an image.
> AccessGranted(address indexed from, address indexed to): Emitted when a user grants access to another user.
4. State Variables
> uploadedPersons: An array of addresses representing users who have uploaded images.

## Functions Overview
1. uploadImages(address addr, string memory url)
> Allows a user to upload an image and records it under their address. If it's the user's first upload, their address is added to a list of users who have uploaded images.
2. getWhoHasUploaded()
> Returns a list of all users who have uploaded images.
3. giveAccess(address addr)
> Grants another user access to view the caller's uploaded images.
4. buyAccess(address from)
> Allows a user to buy access to another user's images by paying a small amount of Ether.
5. buyImages(address addr, uint256 _id)
> Allows a user to purchase a specific image from another user by paying a small amount of Ether.
6. getBuyedImages(address addr)
> Returns a list of images that the specified user has purchased.
7. revokeAccess(address addr)
> Revokes a previously granted access from another user, removing their ability to view the caller's images.
8. getAccessedImages(address from)
> Retrieves the images of a user if the caller has been granted access to them.
9. getAccessedUser()
> Returns a list of users to whom the caller has granted access.
10. getAccessedBy(address addr)
> Returns a list of users who have granted the caller access to their images.


### Usage
1) Uploading Images:
> Use uploadImages to upload images to the platform. The images are associated with the user's address.

2) Granting Access:
> Use giveAccess to allow specific users to view your images.

3) Purchasing Access:
> Use buyAccess to buy access to another user's images. You must send a small amount of Ether to complete this transaction.

4) Revoking Access:
> Use revokeAccess to remove previously granted access from a user.

5) Viewing Purchased Images:
> Use getBuyedImages to view the list of images you have purchased access to.