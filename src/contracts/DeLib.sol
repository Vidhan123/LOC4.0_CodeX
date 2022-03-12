// contracts/DeLib.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./BasicMetaTransaction.sol";
// import "./PriceConsumerV3.sol";

contract DeLib is BasicMetaTransaction {
  // Chainlink Oracle
  // PriceConsumerV3 private oracle;

  // Has admin access
  address public admin;
  
  uint256 public bookCount;
  uint256 public categoryCount;
  uint256 public userCount;
  uint256 private shelfCount;

  // ------------- Structs -----------------
  struct Book {
    uint256 bookId;
    string title;
    string author;
    string description;
    uint256 dateAdded;
    string coverPage; // did
    bool eBookAvailable;
    string fileHash; // did of eBook
    uint256 totalStock;
    uint256 availableStock;
    uint256 avgRating;
    uint256 reviewersCount;
  }

  struct User {
    uint256 userId;
    string name;
    string email;
    address account;
    string pub;
    uint256 dateAdded;
    bool isMember;
  }

  struct Category {
    uint256 categoryId;
    string name;
    string displayImage; // did
    uint256[] data; // bookIds
  }

  struct Shelf {
    uint shelfId;
    string name;
    uint256[] data; // fileIds
    address owner;
  }

  // ------------- Mappings -----------------
  // Common mappings
  mapping(uint256 => Book) private books;
  mapping(address => uint256[]) private myBooks;

  mapping(uint256 => User) private users;
  mapping(address => uint256) private addressIndex;
  mapping(string => uint256) private emailIndex;

  mapping(uint256 => Category) private categories;

  // e-Library
  mapping(uint256 => Shelf) private shelves;
  mapping(address => uint256[]) private myShelves;

  // ------------- Events -----------------
  event Rate(
    uint256 indexed bookId, 
    address indexed reviewer, 
    uint256 indexed rating, 
    string comment, 
    uint256 timestamp
  );
  event Request(
    string title,
    string author,
    address indexed requester,
    uint256 timestamp
  );
  // Library
  event Borrow(
    uint256 indexed bookId, 
    address indexed borrower, 
    uint256 timestamp
  );
  event Return(
    uint256 indexed bookId, 
    address indexed borrower, 
    uint256 timestamp
  );
  event Renew(
    uint256 indexed bookId, 
    address indexed borrower, 
    uint256 timestamp
  );
  
  // ------------- Constructor -----------------
  constructor(address _admin) {
    admin = _admin;
  }
  // constructor(address _admin, address _oracle) {
  //   admin = _admin;
  //   oracle = PriceConsumerV3(_oracle);
  // }

  // ------------- Modifiers -----------------
  modifier onlyAdmin() {
    require(msgSender() == admin , "Not an admin!");
    _;
  }

  // User with active membership
  modifier onlyMember() {
    User memory user = users[addressIndex[msgSender()]]; 
    require(
      (user.userId > 0) && (user.isMember), "Not a member!"
      );
    _;
  }

  modifier onlyUser() {
    require(addressIndex[msgSender()] > 0, "Not a user!");
    _;
  }

  // ------------- Methods -----------------
  
  // --- User methods ---
  function updateMembership(string memory _email, bool _isMember) public onlyAdmin {
    require(emailIndex[_email] > 0, "No such user exists!");

    users[emailIndex[_email]].isMember = _isMember;
  }

  function getUser(string memory _email) public view returns(User memory user) {
    return users[emailIndex[_email]];
  }

  function getAllUsers() public view returns(User[] memory allUsers) {
    User[] memory temp = new User[](userCount);

    for(uint256 i=1; i<=userCount; i++) {
      temp[i-1] = users[i];
    }

    return temp;
  } 

  function signup(string memory _name, string memory _email, string memory _pub) public {
    if(emailIndex[_email] > 0) return;

    userCount++;
    emailIndex[_email] = userCount;
    addressIndex[msgSender()] = userCount;
    users[userCount] = User(userCount, _name, _email, msgSender(), _pub, block.timestamp, false);
  }

  // --- Book methods ---
  function addBook(string memory _title, string memory _author, string memory _description, string memory _coverPage, bool _eBook, string memory _fileHash, uint256 _stock) public onlyAdmin {
    
    bookCount++;
    books[bookCount] = Book(bookCount, _title, _author, _description, block.timestamp, _coverPage, _eBook, _fileHash, _stock, _stock, 0, 0);
  }

  function updateBook(uint256 _bookId, string memory _title, string memory _author, string memory _description, string memory _coverPage, bool _eBook, string memory _fileHash, uint256 _stock) public onlyAdmin {
    
    Book storage book = books[_bookId];
    
    require(book.bookId > 0, "No such book exists!");
    
    book.title = _title;
    book.author = _author;
    book.description = _description;
    book.coverPage = _coverPage;
    book.eBookAvailable = _eBook;
    book.fileHash = _fileHash;
    book.availableStock += (_stock - book.totalStock);
    book.totalStock = _stock;
  }

  function getBook(uint256 _bookId) public view returns(Book memory book) {
    return books[_bookId];
  }

  function getAllBooks() public view returns(Book[] memory allBooks) {
    Book[] memory temp = new Book[](bookCount);

    for(uint256 i=1; i<=bookCount; i++) {
      temp[i-1] = books[i];
    }

    return temp;
  }

  function getMyBooks(address _account) public view returns(Book[] memory allMyBooks) {
    uint256[] memory bookIds = myBooks[_account];

    Book[] memory allBooks = new Book[](bookIds.length);

    for(uint256 i=0; i<bookIds.length; i++) {
      allBooks[i] = books[bookIds[i]];
    }

    return allBooks;
  }

  function updateMyBooks(uint256[] memory _bookIds) public onlyMember {
    myBooks[msgSender()] = _bookIds;
  }

  function borrowBook(uint256 _bookId, address _borrower) public onlyAdmin {
    require(books[_bookId].availableStock > 0, "Book unavailable!");

    books[_bookId].availableStock--;
    
    emit Borrow(_bookId, _borrower, block.timestamp);
  }

  function renewBook(uint256 _bookId, address _borrower) public onlyMember {
    emit Renew(_bookId, _borrower, block.timestamp);
  }

  function returnBook(uint256 _bookId, address _borrower) public onlyAdmin {
    require(books[_bookId].bookId > 0, "No such book exists!");

    books[_bookId].availableStock++;
    
    emit Return(_bookId, _borrower, block.timestamp);
  }

  function rateBook(uint256 _bookId, uint256 _rating, string memory _comment) public onlyMember {
    Book storage book = books[_bookId];
    
    require(book.bookId > 0, "No such book exists!");

    book.avgRating = (book.avgRating * book.reviewersCount + _rating) / (book.reviewersCount + 1);
    book.reviewersCount++;

    emit Rate(_bookId, msgSender(), _rating, _comment, block.timestamp);
  }

  function requestBook(string memory _title, string memory _author) public onlyMember {
    emit Request(_title, _author, msgSender(), block.timestamp);
  }

  // --- Category methods ---
  function addCategory(string memory _name, string memory _displayImage, uint256[] memory _data) public onlyAdmin {

    categoryCount++;
    categories[categoryCount] = Category(categoryCount, _name, _displayImage, _data);
  } 

  function updateCategory(uint256 _categoryId, string memory _name, string memory _displayImage, uint256[] memory _data) public onlyAdmin {
   
    Category storage category = categories[_categoryId];

    require(category.categoryId > 0, "No such category exists!");
    
    category.name = _name;
    category.displayImage = _displayImage;
    category.data = _data;
  }

  function removeCategory(uint _categoryId) public onlyAdmin {
    require(categories[_categoryId].categoryId > 0, "No such category exists!");

    delete categories[_categoryId];
  }

  function getCategories() public view returns(Category[] memory allCategories) {
    Category[] memory temp = new Category[](categoryCount);

    for(uint256 i=1; i<=categoryCount; i++) {
      temp[i-1] = categories[i];
    }

    return temp;
  }

  // --- Shelf methods ---
  function addShelf(string memory _name, uint256[] memory _data) public onlyMember {
    shelfCount++;
    shelves[shelfCount] = Shelf(shelfCount, _name, _data, msgSender());
    
    myShelves[msgSender()].push(shelfCount);
  } 

  function updateShelf(uint256 _shelfId, string memory _name, uint256[] memory _data) public onlyMember {
    Shelf storage shelf = shelves[_shelfId];
    
    shelf.name = _name;
    shelf.data = _data;
  }

  function removeShelf(uint _shelfId) public onlyMember {
    delete shelves[_shelfId];
  }

  function getMyShelves(address _account) public view returns(Shelf[] memory allMyShelves) {
    uint256[] memory shelfIds = myShelves[_account];

    Shelf[] memory allShelves = new Shelf[](shelfIds.length);

    for(uint256 i=0; i<shelfIds.length; i++) {
      allShelves[i] = shelves[shelfIds[i]];
    }

    return allShelves;
  } 

  function updateMyShelves(uint256[] memory _shelfIds) public onlyMember {
    myShelves[msgSender()] = _shelfIds;
  }

  // --- Chainlink oracle methods ---
  // function getMATICUSDPrice() public view returns(uint256) {
  //   uint256 price8 = uint(oracle.getLatestPriceMatic());
  //   return price8*(10**10);
  // }

  // function setOracle(address _oracle) public onlyAdmin {
  //   oracle = PriceConsumerV3(_oracle);
  // }

  // --- Addtional methods ---
  function setAdmin(address _admin) public onlyAdmin {
    admin = _admin;
  }

  // function withdrawDonations(address payable _account) public onlyAdmin {
  //   require(address(this).balance > 0, "Balance must be positive");

  //   _account.transfer(address(this).balance);
  // }
}