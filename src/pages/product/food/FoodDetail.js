import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useFoodContext } from './FoodContext/FoodContext.js';
import { FOOD_ITEM } from '../../../config.js';
import { FOOD_COMMENT } from '../../../config.js';
import { useFoodCart } from '../../cart/utils/useCart';
import FoodMap from './FoodMap';
import Comment from './Comment';
import CommentSelector from './CommentSelector';
import FoodBookingBar from './FoodBookingBar';
import NavBar from '../../../layout/NavBar';
import Footer from '../../../layout/Footer';
import BreadCrumb from './BreadCrumb';
import Carousel from '../../../Component/Carousel/Carousel';
import Card_Carousel from '../../../Component/Carousel/Card_Carousel';
import HashChange from './HashChange';
import Heart from '../../../icon/heart_gray.svg';
import PinkHeart from '../../../icon/heart.svg';
import Calendar from '../../../icon/calendar+add.svg';
import ActiveCalendar from '../../../icon/calendar+greenadd.svg';
import Map_icon from '../../../icon/map_blue.svg';
import Food_icon from '../../../icon/food_blue.svg';
import Phone_icon from '../../../icon/iphone.svg';
import Star_icon from '../../../icon/star.svg';
import Minus_icon from '../../../icon/minus.svg';
import Add_icon from '../../../icon/add.svg';
import House_icon from '../../../icon/house.svg';

import {
  ITINERARY_ADDITEM,
  ITINERARY_LIST,
  ITINERARY_ADDLIST,
} from '../itinerary/site-config';
import { v4 as uuidv4 } from 'uuid';

import './style/FoodDetail.scss';

function FoodDetail() {
  const {
    foodData,
    setFoodData,
    count,
    setCount,
    totalPrice,
    setTotalPrice,
    commentData,
    setCommentData,
    like,
    setLike,
    add,
    setAdd,
    commentSort,
    setCommentSort,
  } = useFoodContext();

  const foodObj = {
    id: foodData.sid,
    name: foodData.product_name,
    quantity: count,
    price: totalPrice,
    img: 'http:/localhost:3001/uploads/F116-1.jpg',
    rate: 4.3,
  };
  const toggleLike = () => setLike(!like);
  const toggleAdd = () => setAdd(!add);

  const location = useLocation();
  // const path = window.location.pathname.split('/');
  // const sid = path[2];

  async function getData() {
    //?????????????????????foodData
    const response = await axios.get(FOOD_ITEM + 116);
    setFoodData(response.data);
    setTotalPrice(response.data.p_selling_price);
  }
  //??????queryString
  const usp = new URLSearchParams(location.search);

  const Food_part0 = useRef();
  const Food_part1 = useRef();
  const Food_part2 = useRef();
  const Food_part3 = useRef();
  const Food_part4 = useRef();
  const [allPart, setAllPart] = useState({});
  const [isScroll, setIsScroll] = useState(false);

  window.addEventListener('scroll', () => {
    if (isScroll === false) {
      setIsScroll(true);
    }
  });
  useEffect(() => {
    if (isScroll) {
      let part0 = Food_part0.current.offsetTop;
      let part1 = Food_part1.current.offsetTop;
      let part2 = Food_part2.current.offsetTop;
      let part3 = Food_part3.current.offsetTop;
      let part4 = Food_part4.current.offsetTop;
      // console.log(part0, part1, part2, part3, part4);
      setAllPart({
        part0: part0,
        part1: part1,
        part2: part2,
        part3: part3,
        part4: part4,
        bodyOffsetY: document.body.offsetHeight,
      });
    }
  }, [isScroll]);

  async function getList() {
    const response = await axios.get(FOOD_COMMENT);
    setCommentData(response.data);
  }
  console.log(commentData);

  const [userData, setUserData] = useState([]);

  async function userDatas() {
    if (localStorage.getItem('auth') !== null) {
      const membersid = JSON.parse(localStorage.getItem('auth')).sid;
      const response = await axios.get(ITINERARY_LIST + '/' + membersid);
      setUserData(response.data);
    }
  }
  const [formData, setFormData] = useState({
    list_number: 0,
    day: 1,
    sequence: 10,
    category: 2,
    category_id: 116,
    time: null,
  });

  const mySubmit = async () => {
    // ?????????????????? ???????????????
    if (localStorage.getItem('auth') === null) {
      return await Swal.fire({
        title: '????????????',
        confirmButtonText: '????????????',
        confirmButtonColor: '#59d8a1',
        showCancelButton: true,
        cancelButtonText: '????????????',
        cancelButtonColor: '#D9D9D9',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = '/logIn';
        }
      });
    }
    let selOptions = {};
    let j = 1;

    userData.map((el, i) => {
      selOptions[i] = el.list_name;
      j++;
    });
    const newOpt = { ...selOptions, newList: `????????????` };
    const { value: selected } = await Swal.fire({
      title: '??????????????????????',
      input: 'select',
      inputOptions: newOpt,
      inputPlaceholder: '',
      confirmButtonText: '??????',
      confirmButtonColor: '#59d8a1',
      showCancelButton: true,
      cancelButtonText: '??????',
      cancelButtonColor: '#D9D9D9',
    });
    console.log(selected);

    if (selected === 'newList') {
      const { value: listname } = await Swal.fire({
        title: '??????????????????',
        input: 'text',
        inputValue: `????????????${j}`,
        confirmButtonText: '??????',
        confirmButtonColor: '#59d8a1',
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return '?????????????????????';
          }
        },
      });

      const membersid = JSON.parse(localStorage.getItem('auth')).sid;
      const listNumber = uuidv4();
      const { data } = await axios.post(ITINERARY_ADDLIST, {
        member_sid: membersid,
        list_number: listNumber,
        list_name: listname,
        day: 1,
        status: 1,
      });
      if (data.success) {
        const { data } = await axios.post(ITINERARY_ADDITEM, {
          list_number: listNumber,
          day: 1,
          sequence: 10,
          category: 2,
          category_id: 116,
          time: null,
        });
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: `????????????`,
            confirmButtonText: '??????',
            confirmButtonColor: '#59d8a1',
          });
        } else {
          console.log('error1');
        }
      }
    } else if (selected <= userData.length) {
      setFormData({
        list_number: userData[selected].list_number,
        day: 1,
        sequence: 10,
        category: 1,
        category_id: 116,
        time: null,
      });
      const { data } = await axios.post(ITINERARY_ADDITEM, {
        list_number: userData[selected].list_number,
        day: 1,
        sequence: 10,
        category: 1,
        category_id: 116,
        time: null,
      });
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: `?????????${selOptions[selected]}`,
          confirmButtonText: '??????',
          confirmButtonColor: '#59d8a1',
        });
      } else {
        console.log('error2');
      }
    }
  };

  useEffect(() => {
    userDatas();
  }, [location]);

  useEffect(() => {
    getList();
  }, [location]);
  useEffect(() => {
    getData();
  }, []);

  const { addItem } = useFoodCart();
  return (
    <>
      <NavBar />
      <div className="MobileHidden">
        <FoodBookingBar foodData={foodData} />
      </div>
      <div style={{ width: '100%', height: '79px' }}></div>
      <div className="ComputerHidden">
        <HashChange allPart={allPart} />
      </div>
      <div className="container" style={{ marginTop: '80px' }}>
        <div ref={Food_part0} id="Food_part0"></div>
        <nav aria-label="breadcrumb">
          <div className="container breadcrumb mt-5">
            <BreadCrumb foodData={foodData} />
          </div>
        </nav>

        <div className="container carousel">
          <Carousel />
        </div>
        <div className="container">
          <div className="product_name d-flex">
            <div className="product_name_title">
              <h1>{foodData.product_name} WANCHUHAO</h1>
            </div>

            <div className="Heart_Calendar_icon">
              <button className="HeartBtn" onClick={toggleLike}>
                <img
                  src={like ? PinkHeart : Heart}
                  className="Heart_icon"
                  alt=""
                />
              </button>
              <button
                className="CalendarBtn"
                onClick={() => {
                  mySubmit();
                  // Swal.fire({
                  //   icon: 'success',
                  //   title: '?????????????????????',
                  // });
                  // toggleAdd();
                }}
              >
                {/* <img
                  src={add ? ActiveCalendar : Calendar}
                  className="Calendar_icon"
                  alt=""
                /> */}
                <img src={Calendar} className="Calendar_icon" alt="" />
              </button>
            </div>
          </div>
          <div className="star_group">
            <img src={Star_icon} alt="" />
            <img src={Star_icon} alt="" />
            <img src={Star_icon} alt="" />
            <img src={Star_icon} alt="" />
            <p>4.3??????</p>
          </div>
          <div className="container location d-flex ">
            <div className="map_cate d-flex ">
              <div className="map d-flex">
                <img src={Map_icon} alt="" className="Map_icon" />
                <p>
                  {foodData.city_name} | {foodData.area_name}
                </p>
              </div>
              <div className="cate d-flex">
                <img src={Food_icon} alt="" className="Food_icon" />
                <p>{foodData.categories_name}</p>
              </div>
            </div>
            <div className="tickets_group d-flex ">
              <img src={Phone_icon} alt="" className="Phone_icon" />
              <p className="tickets">?????????????????????</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container d-flex">
        <div className="col-lg-8  product_text">
          <div className="container product_text">
            <p>{foodData.product_introdution}</p>
          </div>
        </div>
        <div className="choose col-lg-3 align-items-center ">
          <p className="quantity_title">????????????</p>
          <div className="quantity d-flex">
            <button
              className="countBtn"
              onClick={() => {
                const newMinusCount = count - 1;
                if (count === 1) {
                  return count;
                } else {
                  setCount(newMinusCount);
                }
                const newMinusTotalPrice =
                  totalPrice - foodData.p_selling_price;
                if (totalPrice === foodData.p_selling_price) {
                  return totalPrice;
                } else {
                  setTotalPrice(newMinusTotalPrice);
                }
              }}
            >
              <img src={Minus_icon} alt="" className="Minus_icon" />
            </button>
            <p>{count}</p>
            <button
              className="countBtn"
              onClick={() => {
                const newAddCount = count + 1;
                setCount(newAddCount);
                const newAddTotalPrice = foodData.p_selling_price * newAddCount;
                setTotalPrice(newAddTotalPrice);
              }}
            >
              <img src={Add_icon} alt="" className="Add_icon" />
            </button>
          </div>
          <div className="price">
            <h2 className="price1">TWD{foodData.p_discounted_price}</h2>
            <h1 className="price2">
              TWD
              {foodData.p_selling_price ? totalPrice : foodData.p_selling_price}
            </h1>
          </div>
          <div className="btnGroup">
            <button
              type="button"
              className="btn add_cart"
              onClick={() => {
                Swal.fire({
                  icon: 'success',
                  title: '?????????????????????',
                  confirmButtonText: '??????',
                  confirmButtonColor: '#59d8a1',
                });
                addItem(foodObj);
              }}
            >
              ???????????????
            </button>
            <button type="button" className="btn buy_now">
              ????????????
            </button>
          </div>
        </div>
      </div>
      <div className="Food_partHidden" id="Food_part1" ref={Food_part1}></div>
      <div className="container product_information d-flex ">
        <div className="col-lg-8" style={{ marginRight: 'auto' }}>
          <h2>????????????</h2>
          <div className=" product_information_img">
            <div className="product_information_img_div1 col-lg-8">
              <div className="product_information_img1"></div>
            </div>
            <p>??????????????????(???)</p>
            <div className="product_information_img_div2 col-lg-8">
              <div className="product_information_img2"></div>
            </div>
            <p>???????????????</p>
            <div className="product_information_img_div3 col-lg-8">
              <div className="product_information_img3"></div>
            </div>
            <p>???????????????</p>
          </div>
          <div
            className="Food_partHidden"
            id="Food_part2"
            ref={Food_part2}
          ></div>
          <div className="how_to_use ">
            <div className="use_title_img d-flex align-items-center">
              <img
                src={Phone_icon}
                style={{ width: '30px', height: '30px' }}
                alt=""
              />
              <h2>????????????</h2>
            </div>
            <ul>
              <li>???????????????QRCODE</li>
            </ul>
          </div>
          <div
            className="Food_partHidden"
            id="Food_part3"
            ref={Food_part3}
            // style={{ backgroundColor: 'red', height: '5px' }}
          ></div>
          <div className="store ">
            <div className="store_title_img d-flex align-items-center">
              <img
                src={House_icon}
                style={{ width: '30px', height: '30px' }}
                alt=""
              />
              <h2>????????????</h2>
            </div>
            <p>{foodData.product_name}</p>
            <p>?????????{foodData.product_address}</p>
            <p>???????????????{foodData.p_business_hours}</p>
            <div className="foodmap" style={{ zIndex: '-1' }}>
              <FoodMap />
            </div>
          </div>
          <div
            className="Food_partHidden"
            id="Food_part4"
            ref={Food_part4}
          ></div>
          <div className="container commitGroup ">
            <div className="">
              <div
                className="d-flex  commitTitle"
                style={{ alignItems: 'center' }}
              >
                <h2
                  style={{
                    color: '#4D4D4D',
                    margin: '40px 0px',
                    marginRight: 'auto',
                  }}
                >
                  ????????????
                </h2>
                <CommentSelector />
              </div>
              <Comment rows={commentData} className="commit" />
            </div>
          </div>
        </div>
        <div className="col-lg-3 foodHashChange MobileHidden">
          <HashChange allPart={allPart} />
        </div>
      </div>
      <div className="givePadding"></div>
      <div className="container mobileShow">
        <h2 className="cardCarouselTitle">??????????????????</h2>
        <Card_Carousel className="cardCarousel" />
      </div>

      <Footer />
    </>
  );
}

export default FoodDetail;
