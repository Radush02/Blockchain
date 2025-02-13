import { expect } from "chai";
import { ethers } from "hardhat";

describe("Event", function () {
    let Event, BiletNFT, event, bilet, owner, user;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        Event = await ethers.getContractFactory("Event");
        event = await Event.deploy("Festival Rockstadt", ethers.parseEther("0.1"), 50, owner);
        await event.deploymentTransaction()?.wait(1);

        BiletNFT = await ethers.getContractFactory("BiletNFT");
        bilet = await BiletNFT.deploy("Festival Rockstadt", "FEST", ethers.parseEther("0.1"), 50, owner);
        await bilet.deploymentTransaction()?.wait(1);

        await event.setBilet(bilet.getAddress());
        await owner.sendTransaction({to: event.getAddress(), value: ethers.parseEther("1.0"),});
    });

    it("Should allow refund if event is canceled", async function () {
        await event.connect(user).cumparaBilet({ value: ethers.parseEther("0.1") });
        await event.connect(owner).anuleazaEvent();
        console.log("adresa bilet in event:", await event.bilet());
        console.log("adresa biletului creat:", await bilet.getAddress());

        console.log("User" + await user.getAddress());
        console.log("Owner" + await owner.getAddress());
        await expect(
           event.connect(user).refundBilet(1)
        )
        .to.emit(event, "RefundCerut")
        .withArgs(user.getAddress(), 1);
    });

    it("should allow a user to buy a ticket through Event contract", async function () {
        await expect(
            event.connect(user).cumparaBilet({ value: ethers.parseEther("0.1") })
        )
        .to.emit(event, "BiletCumparatEvent")
        .withArgs(user.getAddress());
    });




    it("Should not allow ticket purchase if event is canceled", async function () {
        await event.connect(owner).anuleazaEvent();

        await expect(
            event.connect(user).cumparaBilet({ value: ethers.parseEther("0.1") })
        ).to.be.revertedWith("Evenimentul este anulat");
    });

    it("Should fail refund if event is not canceled", async function () {
        await event.connect(user).cumparaBilet({ value: ethers.parseEther("0.1") });

        await expect(
            event.connect(user).refundBilet(1)
        ).to.be.revertedWith("Evenimentul nu este anulat");
    });
});