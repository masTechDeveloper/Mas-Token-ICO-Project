pragma solidity >=0.4.21 <0.7.0;


contract MasToken {
    string public name = "Mas Token";
    string public symbol = "MAS";
    string public standard = "MAS Token v1.0";
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address receiver, uint256 amount)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= amount, "Balance insuficent");
        balanceOf[msg.sender] -= amount;
        balanceOf[receiver] += amount;
        emit Transfer(msg.sender, receiver, amount);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool sucess)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(_value <= balanceOf[_from], "Value is > of balance");
        require(
            _value <= allowance[_from][msg.sender],
            "Value is > off allownce"
        );
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
