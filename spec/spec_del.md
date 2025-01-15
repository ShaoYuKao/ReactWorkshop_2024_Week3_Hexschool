
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
