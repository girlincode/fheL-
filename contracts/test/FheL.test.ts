import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import hre from 'hardhat'
import { Encryptable } from '@cofhe/sdk'

describe('FheL', function () {
  async function deployFixture() {
    const [_, bob, liquidator] = await hre.ethers.getSigners()
    const F = await hre.ethers.getContractFactory('FheL')
    const fhel = await F.deploy()
    await fhel.waitForDeployment()
    return { fhel, bob, liquidator }
  }

  describe('MOCK FHE', function () {
    it('deposit increases encrypted collateral', async function () {
      const { fhel, bob } = await loadFixture(deployFixture)
      const client = await hre.cofhe.createClientWithBatteries(bob)

      const [enc] = await client.encryptInputs([Encryptable.uint64(100n)]).execute()
      await fhel.connect(bob).deposit(enc)

      const c = await fhel.positionOf(bob.address)
      await hre.cofhe.mocks.expectPlaintext(c.collateral, 100n)
      // Debt handle is unset until the first borrow; no mock plaintext entry yet.
    })

    it('borrow respects max LTV', async function () {
      const { fhel, bob } = await loadFixture(deployFixture)
      const client = await hre.cofhe.createClientWithBatteries(bob)

      const [enc100] = await client.encryptInputs([Encryptable.uint64(100n)]).execute()
      await fhel.connect(bob).deposit(enc100)

      const [enc50] = await client.encryptInputs([Encryptable.uint64(50n)]).execute()
      await fhel.connect(bob).borrow(enc50)

      let pos = await fhel.positionOf(bob.address)
      await hre.cofhe.mocks.expectPlaintext(pos.debt, 50n)

      const [enc40] = await client.encryptInputs([Encryptable.uint64(40n)]).execute()
      await fhel.connect(bob).borrow(enc40)

      pos = await fhel.positionOf(bob.address)
      await hre.cofhe.mocks.expectPlaintext(pos.debt, 50n)

      const [enc30] = await client.encryptInputs([Encryptable.uint64(30n)]).execute()
      await fhel.connect(bob).borrow(enc30)

      pos = await fhel.positionOf(bob.address)
      await hre.cofhe.mocks.expectPlaintext(pos.debt, 80n)

      const [enc1] = await client.encryptInputs([Encryptable.uint64(1n)]).execute()
      await fhel.connect(bob).borrow(enc1)

      pos = await fhel.positionOf(bob.address)
      await hre.cofhe.mocks.expectPlaintext(pos.debt, 80n)
    })

    it('liquidate zeros position when debt past liquidation line', async function () {
      const { fhel, bob, liquidator } = await loadFixture(deployFixture)
      const client = await hre.cofhe.createClientWithBatteries(bob)

      const [enc100] = await client.encryptInputs([Encryptable.uint64(100n)]).execute()
      await fhel.connect(bob).deposit(enc100)

      const [enc76] = await client.encryptInputs([Encryptable.uint64(76n)]).execute()
      await fhel.connect(bob).borrow(enc76)

      await fhel.connect(liquidator).liquidate(bob.address)

      const pos = await fhel.positionOf(bob.address)
      await hre.cofhe.mocks.expectPlaintext(pos.collateral, 0n)
      await hre.cofhe.mocks.expectPlaintext(pos.debt, 0n)
    })

    it('liquidate does not clear healthy position', async function () {
      const { fhel, bob, liquidator } = await loadFixture(deployFixture)
      const client = await hre.cofhe.createClientWithBatteries(bob)

      const [enc100] = await client.encryptInputs([Encryptable.uint64(100n)]).execute()
      await fhel.connect(bob).deposit(enc100)

      const [enc50] = await client.encryptInputs([Encryptable.uint64(50n)]).execute()
      await fhel.connect(bob).borrow(enc50)

      await fhel.connect(liquidator).liquidate(bob.address)

      const pos = await fhel.positionOf(bob.address)
      await hre.cofhe.mocks.expectPlaintext(pos.collateral, 100n)
      await hre.cofhe.mocks.expectPlaintext(pos.debt, 50n)
    })
  })
})
