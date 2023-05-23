import React from 'react';

function FooterArea() {
  return (
    <section className="footer-area pt-100px bg-gray">
        <div className="container">
            <div className="row">
                <div className="col-lg-3 responsive-column-half">
                    <div className="footer-item">
                        <h3 className="fs-20 font-weight-semi-bold pb-2">Company</h3>
                        <div className="divider border-bottom-0"><span></span></div>
                        <ul className="generic-list-item">
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Become a Teacher</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-3 responsive-column-half">
                    <div className="footer-item">
                        <h3 className="fs-20 font-weight-semi-bold pb-2">Courses</h3>
                        <div className="divider border-bottom-0"><span></span></div>
                        <ul className="generic-list-item">
                            <li><a href="#">Web Development</a></li>
                            <li><a href="#">Hacking</a></li>
                            <li><a href="#">PHP Learning</a></li>
                            <li><a href="#">Spoken English</a></li>
                            <li><a href="#">Self-Driving Car</a></li>
                            <li><a href="#">Garbage Collectors</a></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-3 responsive-column-half">
                    <div className="footer-item">
                        <h3 className="fs-20 font-weight-semi-bold pb-2">Download App</h3>
                        <div className="divider border-bottom-0"><span></span></div>
                        <div className="mobile-app">
                            <p className="pb-3 lh-24">Download our mobile app and learn on the go.</p>
                            <a href="#" className="d-block mb-2 hover-s"><img src="images/appstore.png" alt="App store" className="img-fluid" /></a>
                            <a href="#" className="d-block hover-s"><img src="images/googleplay.png" alt="Google play store" className="img-fluid" /></a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 responsive-column-half">
                    <div className="footer-item">
                        <h3 className="fs-20 font-weight-semi-bold pb-2">Newsletter</h3>
                        <div className="divider border-bottom-0"><span></span></div>
                        <form method="post" className="subscriber-form">
                            <p className="pb-3 lh-24">Want us to email you about special offers & updates?</p>
                            <div className="form-group">
                                <input type="email" name="email" className="form-control form--control pl-3" placeholder="Enter email address" />
                                <button className="btn theme-btn w-100 mt-3" type="button">Subscribe <i className="la la-arrow-right icon ml-1"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="section-block"></div>
        <div className="copyright-content py-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="d-flex flex-wrap align-items-center">
                            <a href="index.html" className="pr-4">
                                <img src="images/logo.png" alt="footer logo" className="footer__logo" />
                            </a>
                            <p className="copy-desc">Copyright &copy; 2021 <a href="https://techydevs.com/">TechyDevs</a> Inc.</p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="d-flex flex-wrap align-items-center justify-content-end">
                            <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                                <li className="mr-3"><a href="terms-and-conditions.html">Terms & Conditions</a></li>
                                <li className="mr-3"><a href="privacy-policy.html">Privacy Policy</a></li>
                            </ul>
                            <div className="select-container select-container-sm">
                                <select className="select-container-select">
                                    <option value="1">English</option>
                                    <option value="2">Deutsch</option>
                                    <option value="3">Español</option>
                                    <option value="4">Français</option>
                                    <option value="5">Bahasa Indonesia</option>
                                    <option value="6">Bangla</option>
                                    <option value="7">日本語</option>
                                    <option value="8">한국어</option>
                                    <option value="9">Nederlands</option>
                                    <option value="10">Polski</option>
                                    <option value="11">Português</option>
                                    <option value="12">Română</option>
                                    <option value="13">Русский</option>
                                    <option value="14">ภาษาไทย</option>
                                    <option value="15">Türkçe</option>
                                    <option value="16">中文(简体)</option>
                                    <option value="17">中文(繁體)</option>
                                    <option value="17">Hindi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>);
}

export default FooterArea;