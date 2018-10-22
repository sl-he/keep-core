package gjkr

import (
	"math/big"

	"github.com/keep-network/keep-core/pkg/beacon/relay/pedersen"
)

type memberCore struct {
	// ID of this group member.
	ID int
	// Group to which this member belongs.
	group *Group
	// DKG Protocol configuration parameters.
	protocolConfig *DKG
}

// CommittingMember represents one member in a threshold key sharing group, after
// it has a full list of `memberIDs` that belong to its threshold group. A
// member in this state has two maps of member shares for each member of the
// group.
type CommittingMember struct {
	*memberCore

	// Pedersen VSS scheme used to calculate commitments.
	vss *pedersen.VSS
	// Polynomial `a` coefficients generated by member. Number of coefficients
	// equals `dishonestThreshold + 1`.
	//
	// This is private value and should not be exposed.
	secretCoefficients []*big.Int
	// Shares calculated for current member by themself.
	// This is a private value and should not be exposed.
	selfSecretShareS, selfSecretShareT *big.Int
	// Shares calculated for current member by peer group member.
	//
	// receivedSharesS are defined as `s_ji` and receivedSharesT are
	// defined as `t_ji` across the protocol specification.
	receivedSharesS, receivedSharesT map[int]*big.Int
}

// SharingMember represents one member in a threshold key sharing group.
type SharingMember struct {
	*CommittingMember

	shareS, shareT     *big.Int
	publicCoefficients []*big.Int

	receivedGroupPublicKeyShares map[int]*big.Int

	groupPublicKey *big.Int
}
