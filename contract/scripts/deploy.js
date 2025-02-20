

async function main() {
    const [deployer] = await ethers.getSigners();

    const Event = await ethers.getContractFactory("Event");

    const event = await Event.deploy(
        "Festival Rockstadt",       
        ethers.parseEther("0.1"),     
        50                                        
    );

    await event.waitForDeployment();
    console.log("event: ",await event.getAddress());
    const EventFactory = await ethers.getContractFactory("EventFactory");
    const factory = await EventFactory.deploy();

    await factory.waitForDeployment();
    console.log("factory: ",await factory.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
