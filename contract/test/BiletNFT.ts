import { expect } from "chai";
import { ethers } from "hardhat";

describe("BiletNFT", function () {
    let BiletNFT, bilet, owner, user;


    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        BiletNFT = await ethers.getContractFactory("BiletNFT");
        bilet = await BiletNFT.deploy("Concert Dani Mocanu", "MANELE", ethers.parseEther("0.05"), 100,owner);
        await bilet.deploymentTransaction()?.wait(1);
    });

    it("should allow a user to buy a ticket", async function () {
        await expect(
            bilet.connect(user).cumparaBilet({ value: ethers.parseEther("0.05") })
        )
        .to.emit(bilet, "BiletCumparat")
        .withArgs(user.address, 1);

        expect(await bilet.bileteVandute()).to.equal(1);
    });

    it("should fail because the sent ETH is incorrect", async function () {
        await expect(
            bilet.connect(user).cumparaBilet({ value: ethers.parseEther("0.03") })
        ).to.be.revertedWith("Suma de ETH incorect trimisa");
    });

    it("should fail because the user is buying more tickets then available", async function () {
        const smallBiletNFT = await BiletNFT.deploy("Rapid vs FCSB", "FOTBAL", ethers.parseEther("0.05"), 1,owner);

        await smallBiletNFT.deploymentTransaction();
        await smallBiletNFT.connect(user).cumparaBilet({ value: ethers.parseEther("0.05") });
        await expect(
            smallBiletNFT.connect(user).cumparaBilet({ value: ethers.parseEther("0.05") })
        ).to.be.revertedWith("Nu mai sunt bilete disponibile");
    });
});
