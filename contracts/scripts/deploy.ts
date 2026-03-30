import hre from 'hardhat'

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log('Deploying with:', deployer.address)

  const F = await hre.ethers.getContractFactory('FheL')
  const fhel = await F.deploy()
  const deployTx = fhel.deploymentTransaction()
  await fhel.waitForDeployment()
  const addr = await fhel.getAddress()
  console.log('FheL deployed to:', addr)

  if (hre.network.name === 'eth-sepolia' && process.env.ETHERSCAN_API_KEY && deployTx) {
    console.log('Waiting for block confirmations before verify...')
    await deployTx.wait(5)
    try {
      await hre.run('verify:verify', { address: addr, constructorArguments: [] })
      console.log('Verified on Etherscan')
    } catch (e) {
      console.warn('Verify failed (may already be verified):', e)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
