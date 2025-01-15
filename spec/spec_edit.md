## 編輯商品

### 功能描述

使用者可以編輯現有商品的資訊，修改後提交至後端 API 以更新商品資料。

### 使用者流程

1. 在商品列表中點擊欲編輯商品的「編輯」按鈕。
2. 彈出互動視窗 (Modal)與「建立新的產品」互動視窗 (Modal)公用。
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
    | 屬性         | 類型     | 說明     | 必填     |
    | ------------ | -------- | -------- | -------- |
    | imageUrl     | string   | 主圖網址 | true  |
    | title        | string   | 標題     | true  |
    | category     | string   | 分類     | true  |
    | unit         | string   | 單位     | true  |
    | origin_price | number   | 原價     | true  |
    | price        | number   | 售價     | true  |
    | description  | string   | 描述     | true  |
    | content      | string   | 說明     | true  |
    | is_enabled   | boolean  | 是否啟用 | true  |
    | imagesUrl    | [string] | 圖片網址 | false  |


### 資料驗證

- 所有欄位為必填，除非有預設值。
- 價格欄位需為非負數。
- 圖片網址需為有效的 URL 格式。

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
