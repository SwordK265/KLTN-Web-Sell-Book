<template>
  <div class="bg-white">
    <div class="news-letter-footer">
      <div class="wrapper news-letter">
        <label>
          ĐĂNG KÝ NHẬN EMAIL
          <span>Đăng ký nhận thông tin sách mới, sách bán</span>
        </label>
        <form action="#">
          <div class="input-group">
            <input
              type="text"
              placeholder="Tên của bạn"
              class="input-group-form"
            />
            <input
              type="text"
              placeholder="Nhập email của bạn"
              class="input-group-form"
            />
            <select
              name="categories"
              placeholder="Thể loại yêu thích"
              class="input-group-form"
            >
              <option value="">Thể loại yêu thích</option>
              <option value="">Tất cả</option>
            </select>
            <button type="submit" class="btn-form input-group-form">
              ĐĂNG KÝ NGAY
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="wrapper">
      <div class="footer">
        <div class="footer-left">
          <div class="col-footer-left">
            <span>Về công ty</span>
            <ul>
              <li><a href="#">Giới thiệu về công ty</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Góc báo chí</a></li>
              <li><a href="#">Chương trình đại lý</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
            </ul>
          </div>
          <div class="col-footer-left">
            <span>Trợ giúp</span>
            <ul>
              <li><a href="#">Quy định sử dụng</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Phương thức thanh toán</a></li>
              <li><a href="#">Phương thức vận chuyển</a></li>
              <li><a href="#">Các câu hỏi thường gặp</a></li>
              <li><a href="#">Ứng dụng đọc ebook</a></li>
            </ul>
          </div>
          <div class="col-footer-left">
            <span>Tin tức sách</span>
            <ul>
              <li><a href="#">Tin tức</a></li>
              <li><a href="#">Chân dung</a></li>
              <li><a href="#">Điểm sách</a></li>
              <li><a href="#">Phê bình</a></li>
            </ul>
          </div>
          <div class="col-footer-left">
            <span>Tải ứng dụng trên điện thoại</span>
            <figure class="logo-app">
              <span>
                <a
                  target="_blank"
                  href="https://itunes.apple.com/us/app/vinabook-com-mua-s%C3%A1ch-online/id1035230685"
                  rel="nofollow"
                >
                  <img
                    src="https://www.vinabook.com/images/mobile/icon-appstore.png"
                  />
                </a>
              </span>
              <span>
                <a
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.vinabook.vnbecommerce"
                  rel="nofollow"
                >
                  <img
                    src="https://www.vinabook.com/images/mobile/icon-googleplay.png"
                  />
                </a>
              </span>
            </figure>
          </div>
        </div>
        <div class="footer-right">
          <div class="col-footer-right">
            <div class="col-top">
              <span>Chấp nhận thanh toán</span>
              <figure class="icon-payment">
                <img
                  :src="require('@/assets/img/visa.jpg')"
                  width="55"
                  height="38"
                  alt="Visa"
                />
                <img
                  :src="require('@/assets/img/master_card.jpg')"
                  width="55"
                  height="38"
                  alt="Master Card"
                />
                <img
                  :src="require('@/assets/img/jcb.jpg')"
                  width="55"
                  height="38"
                  alt="JCB"
                />
                <img
                  :src="require('@/assets/img/atm.jpg')"
                  width="55"
                  height="38"
                  alt="ATM"
                />
                <img
                  :src="require('@/assets/img/cod.jpg')"
                  width="55"
                  height="38"
                  alt="Cod"
                />
                <img
                  :src="require('@/assets/img/payoo.jpg')"
                  width="55"
                  height="38"
                  alt="Payoo"
                />
              </figure>
            </div>
            <div class="col-below mt-5">
              <span>Thanh toán an toàn</span>
              <figure class="icon-payment">
                <img
                  :src="require('@/assets/img/verify_visa.jpg')"
                  width="55"
                  height="38"
                  alt="Verify Visa"
                />
                <img
                  :src="require('@/assets/img/mastercard_securecode.jpg')"
                  width="55"
                  height="38"
                  alt="Mastercard SecureCode"
                />
                <img
                  :src="require('@/assets/img/onepay.jpg')"
                  width="55"
                  height="38"
                  alt="OnePay"
                />
              </figure>
            </div>
          </div>
          <div class="col-footer-right">
            <span>Đối tác vận chuyển</span>
            <figure class="logo-shipper">
              <img
                :src="require('@/assets/img/vnb_logo_2x.png')"
                width="218"
                height="28"
                alt="Logo VNB"
              />
              <img
                :src="require('@/assets/img/vn-post.jpg')"
                width="184"
                height="44"
                alt="VN Post"
              />
              <img
                :src="require('@/assets/img/dhl.jpg')"
                width="184"
                height="44"
                alt="DHL"
              />
            </figure>
          </div>
          <div class="col-footer-right">
            <span>Đối tác bán hàng</span>
            <figure class="logo-shipper">
              <img
                :src="require('@/assets/img/lazada.jpg')"
                width="115"
                height="41"
                alt="Lazada"
              />
              <img
                :src="require('@/assets/img/shopee.jpg')"
                width="115"
                height="38"
                alt="Shopee"
              />
              <img
                :src="require('@/assets/img/amazon.jpg')"
                width="115"
                height="35"
                alt="Amazon"
              />
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
@import url('./style.css');
</style>
