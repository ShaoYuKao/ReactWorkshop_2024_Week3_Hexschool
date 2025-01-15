# 任務說明

使用 React.js 的各項語法及指令，目標以串接 API 完成一頁式的產品新增、刪除、修改的頁面。

## 完成以下需求：

- 可以新增、編輯、刪除商品功能，並結合後端 API 進行資料管理。操作介面包含一個產品列表和對應的互動視窗 (Modal)，用於編輯或新增產品資料。
- 商品啟用、關閉可以使用不同的顏色標示

## 新增商品

### 功能描述

使用者可以點擊「建立新的產品」按鈕後，彈出新增產品的互動視窗 (Modal)。透過表單新增新的商品，填寫相關資訊並提交至後端 API 以儲存商品資料。

### 資料輸入項目：
   - 主圖片網址 (`imageUrl`)。
   - 多張圖片網址列表 (`imagesUrl`)（最多 5 張）。
   - 產品標題 (`title`)。
   - 分類 (`category`)。
   - 單位 (`unit`)。
   - 原價 (`origin_price`)。
   - 售價 (`price`)。
   - 產品描述 (`description`)。
   - 說明內容 (`content`)。
   - 是否啟用 (`is_enabled`)。

### 使用者流程

1. 點擊「建立新的產品」按鈕。
2. 在彈出的互動視窗 (Modal)中填寫商品相關資訊，包括圖片網址、標題、分類、單位、原價、售價、描述、內容及是否啟用。
3. 使用者可點擊「新增圖片」按鈕，動態增加圖片網址輸入框。
4. 點擊「取消圖片」按鈕移除最後一個輸入框。
5. 點擊「確認」按鈕提交新增請求。
6. 系統將商品資料提交至後端 API，新增成功後關閉互動視窗 (Modal)並刷新商品列表。
7. 系統將商品資料提交至後端 API，新增失敗的錯誤處理：
   - `alert` 方式顯示錯誤訊息（例如：缺少必填資料）。

### API 端點

- **新增商品**
  - 方法：`POST`
  - URL：`https://ec-course-api.hexschool.io/v2/api/{API_PATH}/admin/product`
  - 請求欄位：
    ```json
    {
      "data": {
        "imageUrl": "string",
        "title": "string",
        "category": "string",
        "unit": "string",
        "origin_price": "number",
        "price": "number",
        "description": "string",
        "content": "string",
        "is_enabled": "boolean",
        "imagesUrl": ["string"]
      }
    }
    ```
  - 回應：
    - 成功：新增的商品資料
    - 失敗：錯誤訊息
  - 請求欄位說明
    | 屬性         | 類型     | 說明     |
    | ------------ | -------- | -------- |
    | imageUrl     | string   | 主圖網址 |
    | title        | string   | 標題     |
    | category     | string   | 分類     |
    | unit         | string   | 單位     |
    | origin_price | number   | 原價     |
    | price        | number   | 售價     |
    | description  | string   | 描述     |
    | content      | string   | 說明     |
    | is_enabled   | boolean  | 是否啟用 |
    | imagesUrl    | [string] | 圖片網址 |

### 資料驗證

- 所有欄位為必填，除非有預設值。
- 價格欄位需為非負數。
- 圖片網址需為有效的 URL 格式。

## 編輯商品

### 功能描述

使用者可以編輯現有商品的資訊，修改後提交至後端 API 以更新商品資料。

### 使用者流程

1. 在商品列表中點擊欲編輯商品的「編輯」按鈕。
2. 在彈出的互動視窗 (Modal)中修改商品相關資訊。
3. 使用者可編輯以下內容：
    - 主圖片網址。
    - 多張圖片網址列表。
    - 標題、分類、單位。
    - 原價與售價。
    - 產品描述與說明內容。
    - 啟用狀態。
4. 點擊「確認」按鈕提交更新請求。
5. API 資料格式與新增功能相同。
6. 系統將更新後的商品資料提交至後端 API，更新成功後關閉互動視窗 (Modal)並刷新商品列表。
7. 系統將更新後的商品資料提交至後端 API，更新失敗的錯誤處理：
   - `alert` 方式顯示錯誤訊息（例如：缺少必填資料）。

### API 端點

- **編輯商品**
  - 方法：PUT
  - URL：`https://ec-course-api.hexschool.io/v2/api/{API_PATH}/admin/product/{id}`
  - 請求欄位：
    ```json
    {
      "data": {
        "imageUrl": "string",
        "title": "string",
        "category": "string",
        "unit": "string",
        "origin_price": "number",
        "price": "number",
        "description": "string",
        "content": "string",
        "is_enabled": "boolean",
        "imagesUrl": ["string"]
      }
    }
    ```
  - 回應：
    - 成功：更新的商品資料
    - 失敗：錯誤訊息
  - 請求欄位說明
    | 屬性         | 類型     | 說明     |
    | ------------ | -------- | -------- |
    | imageUrl     | string   | 主圖網址 |
    | title        | string   | 標題     |
    | category     | string   | 分類     |
    | unit         | string   | 單位     |
    | origin_price | number   | 原價     |
    | price        | number   | 售價     |
    | description  | string   | 描述     |
    | content      | string   | 說明     |
    | is_enabled   | boolean  | 是否啟用 |
    | imagesUrl    | [string] | 圖片網址 |


### 資料驗證

- 所有欄位為必填，除非有預設值。
- 價格欄位需為非負數。
- 圖片網址需為有效的 URL 格式。

## 刪除商品

### 功能描述

使用者可以刪除現有商品，系統將從後端資料庫中移除該商品。

### 使用者流程

1. 在商品列表中點擊欲刪除商品的「刪除」按鈕。
2. 在彈出的確認對話框中確認刪除操作。
3. 點擊「刪除」按鈕提交刪除請求。
4. 系統將刪除請求提交至後端 API，刪除成功後刷新商品列表。
5. 系統將刪除請求提交至後端 API，刪除失敗的錯誤處理：
   - `alert` 方式顯示錯誤訊息（例如：缺少必填資料）。

### API 端點

- **刪除商品**
  - 方法：DELETE
  - URL：`https://ec-course-api.hexschool.io/v2/api/{API_PATH}/admin/product/{id}`
  - 回應：
    - 成功：刪除成功訊息
    - 失敗：錯誤訊息

### 資料驗證

- 確認刪除動作需進行二次確認，避免誤刪除。
- 刪除操作需驗證使用者權限。

## 互動視窗 (Modal)行為

- 互動視窗 (Modal)支援 Bootstrap Modal，設定 `keyboard: false` 防止意外關閉。
- Modal 關閉時清空輸入資料，確保下一次操作不受影響。

### 彈窗範例程式碼

在 React 專案中初始化 Bootstrap 互動視窗 (Modal)的。以下是詳細解釋：

- `productModalRef.current` 是一個引用（ref），它指向 DOM 元素。這個引用通常是使用 React 的 `useRef` Hook 來創建的。`useRef` 允許你在組件的整個生命週期中保持對某個 DOM 元素或值的引用，而不會觸發重新渲染。
- `new bootstrap.Modal("#productModal", { keyboard: false })` 是 Bootstrap 提供的用來初始化互動視窗 (Modal)的構造函數。這個構造函數接受兩個參數：
  - 第一個參數 `"#productModal"` 是一個選擇器，用來選擇要初始化為互動視窗 (Modal)的 DOM 元素。在這裡，它選擇了 ID 為 `productModal` 的元素。
  - 第二個參數是一個配置對象 `{ keyboard: false }`，它用來設置互動視窗 (Modal)的行為。在這裡，`keyboard: false` 表示當互動視窗 (Modal)打開時，按下鍵盤上的 Esc 鍵不會關閉互動視窗 (Modal)。

以下為開啟與關閉 Modal 的範例程式碼：

- 開啟 Modal：`productModalRef.current.show();`
- 關閉 Modal：`productModalRef.current.hide();`

## 共用規範

### 錯誤處理

- 顯示清晰的錯誤訊息給使用者，告知操作失敗原因。
- 針對網路錯誤或伺服器錯誤，提示使用者稍後再試。

### 使用者權限

- 只有經過授權的管理員能執行新增、編輯、刪除商品的操作。
- 系統需驗證使用者的 token 以確認權限。

### 使用者介面

- 操作按鈕需具備清晰的標示和直覺的互動設計。
- 互動視窗 (Modal)應具備良好的使用者體驗，包括表單驗證和即時反饋。

### 更新 UI 元素

- 在產品列表中，為新增、編輯、刪除按鈕加入事件處理。
- 修改產品互動視窗 (Modal)，使其能夠同時處理新增和編輯功能。
