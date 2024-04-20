//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.23;

import "./base/UniversalChanIbcApp.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PolymerERC20UC is ERC20, UniversalChanIbcApp {
    
    uint256 internal p_mintInterval;

    mapping(address account => uint256) public _lastFunMint;
    event PointsAdded(address receiver, uint256 amount);
    event MintIntervalUpdated(uint256 interval);

    constructor (address _middleware) ERC20("xPts[CrossChainPts]@mtroym", "xpts") UniversalChanIbcApp(_middleware) {
        uint256 initialMintAmount = 10000 * 10 ** decimals();
        setMintInterval(uint256(120));
        _mint(owner(), initialMintAmount);
    }

    function setMintInterval(uint256 interval) public {
        require(msg.sender == owner(), "only owner can setMintInterval!");
        p_mintInterval = interval;
        emit MintIntervalUpdated(p_mintInterval);
    }

    /**
     * @dev mints the token to the owner of token
     * @param amount the token amount to mint to owner
     */
    function mint(uint256 amount) public {
        require(msg.sender == owner(), "PolymerERC20UC: msg.sender is not owner");
        _mint(msg.sender, amount);
    }

    function devMintTo(uint256 amount, address target) public {
        require(msg.sender == owner(), "PolymerERC20UC: msg.sender is not owner");
        _mint(target, amount);
    }

    /**
     * @dev burns the token from msg.sender
     * @param amount the token amount to burn from `msg.sender`
     */
    function burn(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "PolymerERC20UC: not enougth tokens to burn");
        _burn(msg.sender, amount);
    }

    function _canFunMint(address recipient) public view returns (bool) {
        return _lastFunMint[recipient] + p_mintInterval < block.timestamp;
    }

    function _currentTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }

    function funMint() public returns (uint256) {
        return _funMint();
    }

    function _funMint() internal returns (uint256) {
        uint256 currentTimeStamp = block.timestamp; 
        uint256 randomAmount = uint256( // random points.
            keccak256(abi.encodePacked(currentTimeStamp, msg.sender))) % 10 + 1;
        
        require(_lastFunMint[msg.sender] + p_mintInterval < currentTimeStamp, 
            "PolymerERC20UC: colding down, waiting!");
        _mint(msg.sender, randomAmount * 10 ** decimals());
        _lastFunMint[msg.sender] = currentTimeStamp;

        emit PointsAdded(msg.sender, randomAmount);
        return randomAmount;
    }

    // IBC 

    /**
     * @dev make the crosschain transfer
     * @param destPortAddr The address of the destination application.
     * @param channelId The ID of the channel to send the packet to.
     */
    function crosschainTransfer(address destPortAddr, bytes32 channelId, address to, uint256 amount) public {
        address from = msg.sender;
        crosschainTransferFrom(destPortAddr, channelId, from, to, amount);
    }

    /// @dev 
    function crosschainTransferFrom(address destPortAddr, bytes32 channelId, address from, address to, uint256 amount) public {
        require(balanceOf(from) >= amount, "PolymerERC20UC: amount exceeded balance");
        
        if (from != msg.sender) {
            require(allowance(from, msg.sender) >= amount, "PolymerERC20UC: crosschain transfer amount exceeds allowance");
            _spendAllowance(from, msg.sender, amount);
            // decreaseAllowance(from, amount);
        }
        bytes memory payload = abi.encode(from, to, amount);
        uint64 timeoutTimestamp = uint64((block.timestamp + 36000) * 1000000000);
        IbcUniversalPacketSender(mw).sendUniversalPacket(
            channelId, IbcUtils.toBytes32(destPortAddr), payload, timeoutTimestamp
        );
        // funds sent. burn on source chain
        _burn(from, amount);
    }

    /**
     * @dev Packet lifecycle callback that implements packet receipt logic and returns and acknowledgement packet.
     *      Also mint the amount to `to`
     * @param channelId the ID of the channel (locally) the packet was received on.
     * @param packet the Universal packet encoded by the source and relayed by the relayer.
     */
    function onRecvUniversalPacket(bytes32 channelId, UniversalPacket calldata packet)
        external
        override
        onlyIbcMw
        returns (AckPacket memory ackPacket)
    {
        recvedPackets.push(UcPacketWithChannel(channelId, packet));

        (address from, address to, uint256 amount) = abi.decode(packet.appData, (address, address, uint256));
        // funds received. mint it on destination chain       
        _mint(to, amount);

        return AckPacket(true, abi.encode(from, to, amount));
    }

    /**
     * @dev Packet lifecycle callback that implements packet acknowledgment logic.
     *      If crosschain transfer is successful, than this function is called.
     * @param channelId the ID of the channel (locally) the ack was received on.
     * @param packet the Universal packet encoded by the source and relayed by the relayer.
     * @param ack the acknowledgment packet encoded by the destination and relayed by the relayer.
     */
    function onUniversalAcknowledgement(bytes32 channelId, UniversalPacket memory packet, AckPacket calldata ack)
        external
        override
        onlyIbcMw
    {
        ackPackets.push(UcAckWithChannel(channelId, packet, ack));

        // decode the crosschainTrasfer data from the ack packet
        (address from, address to, uint256 amount) = abi.decode(ack.data, (address, address, uint256));

        // the funds is received on destination chain, so there are no need to do something. May be grant NFT
    }

    /**
     * @dev if crosschainTransfer packet is timed out, than we return funds back to sender
     * @param channelId the ID of the channel (locally) the timeout was submitted on.
     * @param packet the Universal packet encoded by the counterparty and relayed by the relayer
     */
    function onTimeoutUniversalPacket(bytes32 channelId, UniversalPacket calldata packet) external override onlyIbcMw {
        timeoutPackets.push(UcPacketWithChannel(channelId, packet));
        (address from, address to, uint256 amount) = abi.decode(packet.appData, (address, address, uint256));

        // funds not tranfered to receiver on destination chain. So we return back the funds to the sender
        _mint(from, amount);
    }

}