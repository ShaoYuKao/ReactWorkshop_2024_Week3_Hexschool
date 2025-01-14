import { useState, useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import './App.css';

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "202501-react-shaoyu";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  }); // 登入表單資料
  const [isAuth, setIsAuth] = useState(false);  // 是否為管理員
  const [products, setProducts] = useState([]); // 產品列表
  const [tempProduct, setTempProduct] = useState(null); // 單一產品細節
  const [isLoading, setIsLoading] = useState(false); // 是否載入中
  const [pagination, setPagination] = useState({
    "total_pages": 1,
    "has_pre": false,
    "has_next": false,
    "category": ""
  }); // 分頁資訊
  const [currentGroup, setCurrentGroup] = useState(0); // 目前群組索引
  const [currentPage, setCurrentPage] = useState(1); // 目前頁數
  const productModalRef = useRef(null);

  useEffect(() => {
    if (getToken()) {
      checkAdmin();
    }
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    });
  }, []);

  useEffect(() => {
    if (isAuth) {
      fetchProducts();
    }
  }, [isAuth]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  /**
   * 檢查使用者是否為管理員
   */
  const checkAdmin = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);

    const url = `${API_BASE}/api/user/check`;
    axios.defaults.headers.common.Authorization = token;

    try {
      const res = await axios.post(url);
      const { success } = res.data;
      if (!success) {
        throw new Error("使用者驗證失敗");
      }
      setIsAuth(true);
    } catch (error) {
      console.error("使用者驗證失敗", error);
      clearToken();
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 處理輸入變更事件的函式
   * @param {Object} e 事件對象
   * @param {string} e.target.id - 觸發事件的元素的 ID
   * @param {string} e.target.value - 觸發事件的元素的值
   */
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  /**
   * 使用者點擊[登入]按鈕，處理表單提交的異步函數
   * @param {Event} e 表單提交事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;

      // 寫入 cookie token
      // expires 設置有效時間
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
    } catch (error) {
      alert("登入失敗: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 從伺服器獲取產品資料並更新狀態。
   * @async
   * @function fetchProducts
   * @returns {Promise<void>} 無返回值。
   * @throws 取得產品資料失敗時拋出錯誤。
   */
  const fetchProducts = async () => {
    if (!isAuth) return;

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${currentPage}`
      );
      const { total_pages, current_page, has_pre, has_next, category } = response.data.pagination;
      setPagination({
        ...pagination,
        total_pages: total_pages,
        // current_page: current_page,
        has_pre: has_pre,
        has_next: has_next,
        category: category
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("取得產品資料失敗", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 執行登出操作的非同步函式。
   * 
   * 此函式會向伺服器發送登出請求，並根據伺服器回應的結果進行處理。
   * 如果登出成功，會清除瀏覽器中的 cookie 並更新認證狀態。
   * 如果登出失敗，會在控制台顯示錯誤訊息。
   * 
   * @async
   * @function logout
   * @throws {Error} 如果伺服器回應登出失敗，會拋出錯誤。
   */
  const logout = async () => {
    setIsLoading(true);
    const url = `${API_BASE}/logout`;

    try {
      const res = await axios.post(url);
      const { success, message } = res.data;
      if (!success) {
        throw new Error(message);
      }
    } catch (error) {
      console.error("登出失敗", error);
    } finally {
      axios.defaults.headers.common["Authorization"] = undefined;
      clearToken();
      setIsAuth(false);
      setFormData({
        username: "",
        password: "",
      });
      setIsLoading(false);
    }
  };

  /**
   * 取得 Cookie 中的 hexToken
   * @returns {string|null} 返回 Token 字串，如果不存在則返回 null
   */
  const getToken = () => {
    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    return token || null;
  };

  /**
   * 清除 Token
   * 此函式會將名為 "hexToken" 的 cookie 設定為過期，從而達到清除 Token 的效果。
   */
  const clearToken = () => {
    // 清除 Token
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // === 頁數群組 start ===
  // 每個群組包含的頁數，預設設定為 5
  const pagesPerGroup = 5;

  // 計算總共有多少個群組數
  const totalGroups = Math.ceil(pagination.total_pages / pagesPerGroup);

  /**
   * 處理下一個群組的邏輯。
   * 如果目前的群組索引小於總群組數減一，則將目前的群組索引加一。
   */
  const handleNext = () => {
    if (currentGroup < totalGroups - 1) {
      setCurrentGroup(currentGroup + 1);
    }

    const newCurrentPage = currentPage + 1;
    if (newCurrentPage <= pagination.total_pages) {
      setCurrentPage(newCurrentPage);
    }
  };

  /**
   * 處理上一組的邏輯。
   * 如果 currentGroup 大於 0，則將 currentGroup 減 1。
   */
  const handlePrevious = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
    }

    const newCurrentPage = currentPage - 1;
    if (newCurrentPage > 0) {
      setCurrentPage(newCurrentPage);
    }
  };
  // === 頁數群組 end ===

  return (
    <>
      <Loading loading={isLoading} background="rgba(46, 204, 113, 0.5)" loaderColor="#3498db" />
      {isAuth ? (
        <>
          <div className="container mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary d-block ms-auto"
              onClick={logout}
            >登出</button>
          </div>

          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary">建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td className="text-end">{item.origin_price}</td>
                      <td className="text-end">{item.price}</td>
                      <td>
                        {item.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-outline-primary btn-sm">
                            編輯
                          </button>
                          <button type="button" className="btn btn-outline-danger btn-sm">
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}

              </tbody>
            </table>
            {/* 分頁 (Pagination) */}
            {pagination.total_pages > 1 && (
              <div className="d-flex justify-content-end">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li className={"page-item " + (pagination.has_pre ? "" : "disabled")}>
                      <a className="page-link" href="#" aria-label="Previous" onClick={handlePrevious}>
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>

                    {[...Array(pagesPerGroup)].map((_, index) => {
                      const pageNumber = currentGroup * pagesPerGroup + index + 1;
                      if (pageNumber > pagination.total_pages) return null;
                      return (
                        <li
                          className={"page-item " + (currentPage === Number(pageNumber) ? "active" : "")}
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          <a className="page-link" href="#">{pageNumber}</a>
                        </li>
                      );
                    })}

                    <li className={"page-item " + (pagination.has_next ? "" : "disabled")}>
                      <a className="page-link" href="#" aria-label="Next" onClick={handleNext} >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>新增產品</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img className="img-fluid" src="" alt="" />
                  </div>
                  <div>
                    <button className="btn btn-outline-primary btn-sm d-block w-100">
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-outline-danger btn-sm d-block w-100">
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">標題</label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">分類</label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">單位</label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">原價</label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">售價</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">產品描述</label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">說明內容</label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                取消
              </button>
              <button type="button" className="btn btn-primary">確認</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
