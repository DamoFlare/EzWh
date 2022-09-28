# Design Document 


Authors: Damiano Ferla, Giosuè Gisina, Eugenio Liotine, Maria Akl

Date: 27/04/2022

Version: 1.0


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document 

# High level design 

EZWarehouse is a stand alone application for PC developed using the Javascript programming language. It utilises the Model View Controller (MVC) archtitectural pattern 
MVC with a layereed architecture, separating application data and logic.

EZWarehouse consisted of a 5 packages. EZWarehouse is the link between all packages. The Model package is described below in low level design. The GUI, Exceptions and Data packages are assumed to be provided, and the Data package is assumed to include the EZWarehouseInterface.js API.

The chosen design pattern is the Facade pattern, because the functionalities is provided by a group of classes.  


```plantuml
@startuml

package EZWarehouse
package Model
package Data
package Exceptions
package GUI_EZWarehouse

EZWarehouse <. Model
EZWarehouse <. Data
EZWarehouse <. Exceptions
EZWarehouse <. GUI_EZWarehouse
@enduml
```

# Low level design

```plantuml
@startuml

interface EZWhInterface {

}
note top : The EZWh interface \ncontaining all its corresponding functions,\n each one having a relevant internal role.


class PositionDB {
    static int lastID = 0
    List<Position> positionDB
    +ArrayList<Position> get_positions()
    +void new_position(int posID, int aisleID, int row, int col, float maxWeight, float maxVolume)
    +void edit_position(int posID, int new_AisleID, int new_row, int new_col, float new_maxWeight, float new_maxVolume)
    +void change_position(int posID)
    +void delete_sku_item_by_position(int posID)
}

class Position {
    int positionID
    int aisle
    int row
    int col
    Float max_weight
    Float max_volume
    Float occupied_weight
    Float occupied_volume
    String SKUID
    ArrayList<SKUItem>  skuitems
 }

class SKU {
    int SKUID
    int positionID
    String description
    Float weight
    Float volume
    Float price
    String notes
    int availableQuantity
    ArrayList<SKUItem> availableItems
}

class SKUDB {
    static int lastSKUID = 0
    List<SKU> SKUDB
    +ArrayList<Sku> get_skus()
    +void create_sku(String description, float weight, float volume, String notes, float price, int qty)
    +void edit_sku(int skuId, String new_description, float new_weight, float new_volume, String new_notes, float new_price, int new_quantity)
    +void edit_position(int skuId, Position new_position)
    +void delete_sku(int skuId)
    
}

class SKUItem {
    int RFID
    Boolean available
    ArrayList<TestResult> results
}

class SKUItemDB {
    static int lastSKUID = 0
    List<SKUItem> SKUItemDB
    +ArrayList<SkuItem> get_all_skuItems()
    +ArrayList<SkuItem>  get_skuItems_by_sku(int skuId)
    +SkuItem get_SkuItem(int RFID)
    +void new_SkuItem(int RFID, int skuId, String date)
    +void edit_SkuItem(int new_RFID, bool new_available, String new_dateOfStock)
    +void delete_SkuItem(int RFID)
}

class InternalOrderDB {
    static int lastInternalOrderID = 0
    List<InternalOrder> internalOrderDB
    +ArrayList<InternalOrder> get_internal_orders()
    +ArrayList<InternalOrder> get_issued_internal_orders()
    +ArrayList<InternalOrder> get_accepted_internal_orders()
    +InternalOrder get_internal_order_by_ID(int intOrderId)
    +void create_internal_order(String issueDate, ArrayList<SkuItem> products, int customerId)
    +void edit_internal_order(int intOrderId, String newState, ArrayList<String>)
    +void delete_internal_order(int intOrderId)
}

class InternalOrder{
    int intOrderID
    String date
    String state
    ArrayList<SKU> SKUorder
}

class InventoryCatalogue{
  ArrayList<SKU>  availableSkus
}

class TestResult {
    int resultID
    String date
    Boolean result
}

class TestResultDB{
    static int lastID = 0
    List<TestResult> testResultDB
    +ArrayList<TestResult> get_testResults(int RFID)
    +TestResult get_testResult_by_ID(int RFID, int testID)
    +void create_testResult(int RFID, int testID, String Date, bool result)
    +void set_testResultBy_ID(int RFID,int testID, String Date, bool result)
    +void delete_TestResult_By_ID(int RFID, int testID)
}


class TestDescriptor {
    int descriptorID
    String testname
    String procedureDescrip
    ArrayList<TestResult> results
}

class TestDescriptorDB {
    static int lastTestID = 0
    List<TestDescriptor> TestDescriptorDB
    +ArrayList<TestDescriptor> get_TestDescriptors()
    +TestDescriptor get_TestDescriptor_By_ID(int testID)
    +void create_Test_Descriptor(String name, String procedureDescription, int skuId)
    +void set_TestDescriptor_By_Id(int testID, String name, String procedureDescription, int skuId)
    +void delete_TestDescriptor_By_ID(int testID)
}

class DateOfStock {
    String RFID
    String positionID
    Date dateOfStock
}

class UserDB{
    static int lastID=0
    List<User> userDB
    +User get_user_info()
    +ArrayList<User> get_suppliers()
    +ArrayList<User> get_users()
    +void create_newUser(String username, String name, String surname, String password, String role)
    +ArrayList<String> login_user(String username, String password)
    +bool logout_user()
    +void edit_userRights(String username, String oldRole, String newRole)
    +void delete_user_by_username_and_type(String username, String type) 
}

class User {
    int userID
    String username
    String password
    String role
    String name
    String surname
    String email
}

class RestockOrderDB{
    static int lastRestockOrderID = 0
    List<RestockOrder> restockOrderDB
    +ArrayList<RestockOrders>get_restock_orders()
    +ArrayList<RestockOrders>get_issued_restock_orders()
    +RestockOrders get_restock_order_by_id(int restockOrderId)
    +ArrayList<SkuItem> get_restock_orders_items(int restockOrderId)
    +void create_new_restock_order(String issueDate, ArrayList<SkuItem> products, int supplierId)
    +void edit_restock_order(int restockOrderId, String newState)
    +void add_sku_to_restock_order(int restockOrderId, ArrayList<SkuItem>)
    +void add_transport_note_to_restock_order(int restockOrderId, ArrayList<transportNote>)
    +void delete_restock_order(int restockOrderId)
}

class RestockOrder{
    int restockID
    String issueDate
    String status
    HashMap <Item,Integer> RestockQty
    String transportNote
    int userID
    int supplierID
    int returnID
    ArrayList<String> itemIDToRestock
}

class ReturnOrder{
    int returnID
    Date returndate
    int restockID
    ArrayList<SKUItem> itemsToReturn
}

class ReturnOrderDB{
static int lastReturnOrderID = 0
    List<ReturnOrder> ReturnOrderDB
+ArrayList<ReturnOrders>get_ReturnOrders()
    +ReturnOrders get_ReturnOrder_By_Id(int returnOrderId)
    +void create_New_ReturnOrder(String returnDate, ArrayList<SkuItem> products, int restockOrderId)
    +void delete_ReturnOrder(int returnOrderId)
}

class TransportNote {
    int noteID
    int restockID
    Date shipmentDate 
}

class Data {
    PositionDB positionDB
    SkuDB skuDB
    SkuItemDB skuItemDB
    InternalOrderDB internalOrderDB
    RestockOrderDB restockOrderDB
    TestDescriptorDB testDescriptorDB
    TestResultDB testResultDB
    UserDB userDB
    ItemsDB itemsDB
}

class Supplier{
    int supplierID
    String name
    String adress
    ArrayList<Item> itemsOnSale
}

class Item {
    int itemID
    String description
    String price
    int skuID
    int supplierID
}

class ItemDB {
    static Integer lastItemID = 0
    List<Item> ItemDB
    +ArrayList<Item> get_Items()
    +Item get_Item(int itemID)
    +void new_Item(String description, float price, int skuID, int supplierID)
    +void edit_Item(String itemID, String newDescription, float newPrice)
    +void delete_Item(String itemID)
}

class Customer{
    int customerID
    String name
    String surname
}



' Relations
PositionDB "1"--"*" Position
SKUItemDB "1"--"*" SKUItem
TestResultDB "1"--"*" TestResult
TestDescriptorDB "1"--"*" TestDescriptor
UserDB "1"--"*" User
SKUDB "1"--"*" SKU
ItemDB "1"--"*" Item
InternalOrderDB "1"--"*" InternalOrder
RestockOrderDB "1"--"*" RestockOrder
ReturnOrderDB "1"--"*" ReturnOrder

User "1"--"*" RestockOrder
RestockOrder "*"--"1" Supplier
RestockOrder "1"--"0-1" TransportNote
RestockOrder "1"--"*" Item
RestockOrder "1"--"0-1" ReturnOrder
Item "*"--"1" Supplier
RestockOrder "1"--"*" SKUItem
Item "*"--"1" SKU
ReturnOrder "0-1"--"*" SKUItem
InternalOrder "0-1"--"*" SKUItem
InternalOrder "0-1"--"*" SKU
InventoryCatalogue "1"--"*" SKU
SKU "1"--"*" SKUItem
SKU "*"--"*" TestDescriptor
TestDescriptor "1"--"*" TestResult
SKU "1"--"1" Position
SKUItem "1"--"*" TestResult
SKUItem "*"--"0-1" Position
DateOfStock"1"--"1" SKUItem
DateOfStock"1"--"1" Position
Customer "1"--"*" InternalOrder

Data "1"--"1" EzWH
Data "1"--"1" PositionDB
Data "1"--"1" SKUDB
Data "1"--"1" SKUItemDB
Data "1"--"1" InternalOrderDB
Data "1"--"1" RestockOrderDB
Data "1"--"1" TestDescriptorDB
Data "1"--"1" TestResultDB
Data "1"--"1" UserDB
Data "1"--"1" ItemDB
Data "1"--"1" ReturnOrderDB


EZWhInterface <|- EzWH


@enduml
```

```plantuml
@startuml
interface EZWarehouseInterface{
    +void reset()

    +ArrayList<Sku> getSkus()
    +void createSku(String description, float weight, float volume, String notes, float price, int qty)
    +void editSku(int skuId, String new_description, float new_weight, float new_volume, String new_notes, float new_price, int new_quantity)
    +void editPosition(int skuId, Position new_position)
    +void deleteSku(int skuId)

    +ArrayList<SkuItem> getAllSkuItems()
    +ArrayList<SkuItem>  getSkuItemsBySku(int skuId)
    +SkuItem getSkuItem(int RFID)
    +void newSkuItem(int RFID, int skuId, String date)
    +void editSkuItem(int new_RFID, bool new_available, String new_dateOfStock)
    +void deleteSkuItem(int RFID)

    +ArrayList<Position> getPositions()
    +void newPosition(int posID, int aisleID, int row, int col, float maxWeight, float maxVolume)
    +void editPosition(int posID, int new_AisleID, int new_row, int new_col, float new_maxWeight, float new_maxVolume)
    +void changePosition(int posID)
    +void deleteSkuItemByPosition(int posID)

    +ArrayList<TestDescriptor> getTestDescriptors()
    +TestDescriptor getTestDescriptorByID(int testID)
    +void createTestDescriptor(String name, String procedureDescription, int skuId)
    +void setTestDescriptorById(int testID, String name, String procedureDescription, int skuId)
    +void deleteTestDescriptorByID(int testID)

    +ArrayList<TestResult> getTestResults(int RFID)
    +TestResult getTestResultByID(int RFID, int testID)
    +void createTestResult(int RFID, int testID, String Date, bool result)
    +void setTestResultByID(int RFID,int testID, String Date, bool result)
    +void deleteTestResultByID(int RFID, int testID)

    +User getUserInfo()
    +ArrayList<User> getSuppliers()
    +ArrayList<User> getUsers()
    +void createNewUser(String username, String name, String surname, String password, String role)
    +ArrayList<String> loginUser(String username, String password)
    +bool logoutUser()
    +void editUserRights(String username, String oldRole, String newRole)
    +void deleteUserByUsernameAndType(String username, String type)

    +ArrayList<RestockOrders>getRestockOrders()
    +ArrayList<RestockOrders>getIssuedRestockOrders()
    +RestockOrders getRestockOrderbyId(int restockOrderId)
    +ArrayList<SkuItem> getRestockOrdersItems(int restockOrderId)
    +void createNewRestockOrder(String issueDate, ArrayList<SkuItem> products, int supplierId)
    +void editRestockOrder(int restockOrderId, String newState)
    +void addSkuToRestockOrder(int restockOrderId, ArrayList<SkuItem>)
    +void addTransportNoteToRestockOrder(int restockOrderId, ArrayList<transportNote>)
    +void deleteRestockOrder(int restockOrderId)

    +ArrayList<ReturnOrders>getReturnOrders()
    +ReturnOrders getReturnOrderById(int returnOrderId)
    +void createNewReturnOrder(String returnDate, ArrayList<SkuItem> products, int restockOrderId)
    +void deleteReturnOrder(int returnOrderId)

    +ArrayList<InternalOrder> getInternalOrders()
    +ArrayList<InternalOrder> getIssuedInternalOrders()
    +ArrayList<InternalOrder> getAcceptedInternalOrders()
    +InternalOrder getInternalOrderByID(int intOrderId)
    +void createInternalOrder(String issueDate, ArrayList<SkuItem> products, int customerId)
    +void editInternalOrder(int intOrderId, String newState, ArrayList<String>)
    +void deleteInternalOrder(int intOrderId)

    +ArrayList<Item> getItems()
    +Item getItem(int itemID)
    +void newItem(String description, float price, int skuId, int supplierID)
    +void editItem(int itemID, String newDescription, float newPrice)
    +void deleteItem(int itemID)
}


@enduml
```

# Verification traceability matrix

|  | PositionDB | SKUDB | SKUItemDB | InternalOrderDB | TestDescriptorDB | TestResultDB | UserDB | ItemDB | RestockOrderDB | ReturnOrderDB |  Customer | Supplier | TransportNote |  
|--|:-----------|-------|-----------|-----------------|------------------|--------------|--------|--------|----------------|---------------|-----------|----------|---------------|
|FR1|           |       |           |                 |                  |              |   X    |        |                |               |           |    X     |               |
|FR2|           |   X   |    X      |                 |                  |              |        |        |                |               |           |          |               |
|FR3|  X        |       |           |                 |        X         |      X       |        |        |                |               |           |          |               |
|FR4|           |       |           |                 |                  |              |        |        |                |               |   X       |          |               |
|FR5|           |  X    |           |                 |       X          |      X       |        |        |       X        |     X         |           |   X      |      X        |
|FR6|           |    X  |    X      |     X           |                  |              |        |        |                |               |           |          |               |
|FR7|           |       |           |                 |                  |              |        |  X     |                |               |           |          |               |

# Verification sequence diagrams 

## UC 1.1
```plantuml
@startuml UC 1.1 - Create SKU S
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI: inserts new sku description
"Administrator/Manager" -> GUI: inserts new weight
"Administrator/Manager" -> GUI: inserts new volume
"Administrator/Manager" -> GUI: inserts new SKU notes
"Administrator/Manager" -> GUI: confirms the inserted data
GUI -> EZWarehouse: createSku()
EZWarehouse -> Data: getSkuDB()
Data -> SKUDB: create_sku()
SKUDB -> SKU: new
SKUDB -> GUI: skuId
@enduml
```

## UC 1.3
```plantuml
@startuml UC 1.3 - Modify SKU weight and volume
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI: insert new value for weight 
"Administrator/Manager" -> GUI: insert new value for volume
"Administrator/Manager" -> GUI: confirms the modifications
GUI -> EZWarehouse: editPosition()
EZWarehouse -> Data: getSKUDB()
Data -> SKUDB: edit_position()
SKUDB -> SKU: edit
@enduml
```

## UC 2.1
```plantuml
@startuml UC 2.1 - Create position P
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI: inserts aisleID, row and column
"Administrator/Manager" -> GUI: defines positionID
"Administrator/Manager" -> GUI: defines max weight 
"Administrator/Manager" -> GUI: defines max volume
"Administrator/Manager" -> GUI: confirms the inserted data
GUI -> EZWarehouse: newPosition()
EZWarehouse -> Data: getPositionDB()
Data -> PositionDB: new_position()
PositionDB -> Position: new
PositionDB -> GUI: positionId
@enduml
```

## UC 2.3
```plantuml
@startuml UC 2.3 - Modify weight and volume of P
actor "Administrator/Manager"
"Administrator/Manager" -> GUI: defines new weight for P
"Administrator/Manager" -> GUI: defines new volume for P
"Administrator/Manager" -> GUI: confirms the inserted data
GUI -> EZWarehouse: editPosition()
EZWarehouse -> Data: getPositionDB()
PositionDB -> Position: edit
@enduml
```

## UC 2.4
```plantuml
@startuml UC 2.4 Modify aisle ID, row and column of P
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI: selects position P
"Administrator/Manager" -> GUI: defines new aisle ID for P
"Administrator/Manager" -> GUI: defines new row for P
"Administrator/Manager" -> GUI: defines new column for P
"Administrator/Manager" -> GUI: confirms the inserted data
GUI -> EZWarehouse: editPosition()
EZWarehouse -> Data: getPositionDB()
Data -> PositionDB: edit_position()
PositionDB -> Position: edit
@enduml
```

## UC 2.5
```plantuml
@startuml UC 2.5 Delete position P
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI: selects position P
"Administrator/Manager" -> GUI: confirms the cancellation of P
GUI -> EZWarehouse: deleteSkuItemByPosition()
EZWarehouse -> Data: getPositionDB()
Data -> PositionDB: delete_sku_item_by_position()
PositionDB -> Position: delete
@enduml
```

## UC 3.1
```plantuml
@startuml UC 3.1  Restock Order of SKU S issued by quantity
actor "Manager"
autonumber
"Manager" -> GUI: creates order RO
"Manager" -> GUI: fills quantity of item to be ordered
"Manager" -> GUI: selects supplier SP that can sastisfy order
"Manager" -> GUI: confirms inserted data
GUI -> EZWarehouse: createNewRestockOrder()
EZWarehouse -> Data: getRestockOrderDB()
Data -> RestockOrderDB: create_new_restock_order()
RestockOrderDB -> RestockOrder: new
@enduml
```

## UC 4.1
```plantuml
@startuml UC4.1
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI : defines the credentials of the new account
"Administrator/Manager" -> GUI : selects the access right for the new account
"Administrator/Manager" -> GUI : confirms the inserted data
GUI -> EZWarehouse : createNewUser()
EZWarehouse -> Data : getUserDB()
Data -> UserDB : create_newUser()
UserDB -> User : new
@enduml
```

## UC 4.2
```plantuml
@startuml UC4.2
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI : selects an account to modify user rights
"Administrator/Manager" -> GUI : selects the access rights for the account
"Administrator/Manager" -> GUI : confirms the inserted data
GUI -> EZWarehouse : editUserRights()
EZWarehouse -> Data : getUserDB()
Data -> UserDB : edit_userRights()
UserDB -> User : edit
@enduml
```

## UC 4.3
```plantuml
@startuml UC4.3
actor "Administrator/Manager"
autonumber
"Administrator/Manager" -> GUI : selects an account to delete
"Administrator/Manager" -> GUI : confirms the cancellation
GUI -> EZWarehouse : deleteUserByUsernameAndType()
EZWarehouse -> Data : getUserDB()
Data -> UserDB : delete_user_by_username_and_type()
UserDB -> User : delete
@enduml
```

## UC 5.1.1
```plantuml
@startuml UC 5.1.1 Record restock order arrival
actor "Clerk/Quality Check Employee"
autonumber
"Clerk/Quality Check Employee" -> GUI: selects a RO
GUI -> EZWarehouse: getRestockOrderById()
EZWarehouse -> Data: getRestockOrderDB()
Data -> RestockOrderDB: get_restock_order_by_id()
RestockOrderDB -> RestockOrder: getItemIDToRestock()
RestockOrder -> Data: ArrayList<String>
Data -> Data: getSKUItemDB()
Data -> SKUItemDB: new_sku_item()
SKUItemDB -> SKUItem: new
Data -> RestockOrderDB: edit_restock_order()
RestockOrderDB -> RestockOrder: edit status
@enduml
```

## UC 5.2.1
```plantuml
@startuml UC5.2.1
actor "QualityEmployee"
autonumber
"QualityEmployee" --> GUI : records positive tests result in the system for all SKU items
GUI --> EZWarehouse : createTestResult()
EZWarehouse --> Data : getUserDB()
Data --> TestResultDB : create_test_result()
TestResultDB --> TestResult : new
TestResult --> GUI : resultID
"QualityEmployee" --> GUI: update restock order status with TESTED
EZWarehouse --> Data : getRestockOrderDB()
Data --> RestockOrderDB : edit_restock_order()
RestockOrderDB --> RestockOrder : edit
@enduml
```

## UC 6.1
```plantuml
@startuml UC 6.1 - Return order of SKU items that failed quality test
actor "Manager"
autonumber
"Manager" -> GUI: inserts return order id
GUI -> EZWarehouse: getRestockOrdersItems()
EZWarehouse -> Data: getRestockOrderDB()
Data -> RestockOrderDB: get_restock_orders_items()
RestockOrderDB -> GUI: ArrayList<SkuItem>
"Manager" -> GUI: adds all item to REO 
"Manager" -> GUI: confirms the inserted data
GUI -> EZWarehouse: createNewReturnOrder()
EZWarehouse -> Data: getReturnOrderDB()
Data -> ReturnOrderDB: create_new_return_order()
ReturnOrderDB -> ReturnOrder: new
EZWarehouse -> Data: getSkuItemDB()
Data->SkuItemDB: edit_sku_item()
SkuItemDB -> SkuItem: edit available of the sku item
@enduml
```

## UC 7.1
```plantuml
@startuml UC7.1
actor "GenericUser"
autonumber
"GenericUser" --> GUI : insert username
"GenericUser" --> GUI : insert password
"GenericUser" --> GUI : submit credentials
GUI --> EZWarehouse : loginUser()
EZWarehouse --> Data : getUserDB()
Data --> UserDB : login_user()
UserDB --> User : login
UserDB --> GUI : account informations
"GenericUser" <-- GUI : shows the functionalities offered by the access priviledges of User
@enduml
```

## UC 7.2
```plantuml
@startuml UC7.2
actor "GenericUser"
autonumber
"GenericUser" --> GUI : logout account
GUI --> EZWarehouse : logoutUser()
EZWarehouse --> Data : getUserDB()
Data --> UserDB : logout_user()
UserDB --> User : logout
UserDB --> GUI : true
"GenericUser" <-- GUI : shows the login/sign in page
@enduml
```

## UC 11.1
```plantuml
@startuml UC 11.1 - Create item I
actor "Supplier"
autonumber
"Supplier" -> GUI: inserts new item description
"Supplier" -> GUI: inserts identifier of corresponding SKU
"Supplier" -> GUI: inserts new price
"Supplier" -> GUI: confirms the entered data
GUI -> EZWarehouse: newItem()
EZWarehouse -> Data: getItemDB()
Data->ItemDB: new_item()
ItemDB -> Item: new
@enduml
```

## UC 12.1
```plantuml
@startuml UC12.1
actor "Manager"
autonumber
"Manager" --> GUI : insert name
"Manager" --> GUI : select SKU 
"Manager" --> GUI : insert a description 
"Manager" --> GUI : confirms inserted data
GUI --> EZWarehouse : createTestDescriptor()
EZWarehouse --> Data : getTestDescriptorDB()
Data --> TestDescriptorDB : create_test_descriptor()
TestDescriptorDB --> TestDescriptor : new
TestDescriptor --> GUI : descriptorID
@enduml
```

## UC 12.2
```plantuml
@startuml UC12.2
actor "Manager"
autonumber
"Manager" --> GUI : select test description
"Manager" --> GUI : insert new procedure description
"Manager" --> GUI : confirms updated data
GUI --> EZWarehouse : setTestDescriptorByID()
EZWarehouse --> Data : getTestDescriptorDB()
Data --> TestDescriptorDB : set_test_descriptor_by_ID()
TestDescriptorDB --> TestDescriptor : edit
@enduml
```

## UC 12.3
```plantuml
@startuml UC12.3
actor "Manager"
autonumber
"Manager" --> GUI : select test description
"Manager" --> GUI : confirms cancellation
GUI --> EZWarehouse : deleteTestDescriptorByID()
EZWarehouse --> Data : getTestDescriptorDB()
Data --> TestDescriptorDB : delete_test_descriptor_by_ID()
TestDescriptorDB --> TestDescriptor : delete
@enduml
```
