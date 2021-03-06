const {web3} = require("@openzeppelin/test-environment")

async function grantTokens(
    grantContract,
    token, amount,
    from, grantee,
    unlockingDuration, start, cliff,
    revocable,
    stakingPolicy) {
  let grantData = Buffer.concat([
    Buffer.from(grantee.substr(2), 'hex'),
    web3.utils.toBN(unlockingDuration).toBuffer('be', 32),
    web3.utils.toBN(start).toBuffer('be', 32),
    web3.utils.toBN(cliff).toBuffer('be', 32),
    Buffer.from(revocable ? "01" : "00", 'hex'),
    Buffer.from(stakingPolicy.substr(2), 'hex'),
  ]);

  await token.approveAndCall(grantContract.address, amount, grantData, {from: from})
  return (await grantContract.getPastEvents())[0].args[0].toNumber()
}
module.exports = grantTokens