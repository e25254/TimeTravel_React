import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import NavBar from '../../../layout/NavBar';
import Footer from '../../../layout/Footer';
import '../stays/TimeTravel_Hotel.scss';

import axios from 'axios';
import { useHotelContext } from '../stays/Context/HotelContext';
import { useTicketContext } from './Context/TicketContext';
import { TICKET_DETAIL } from './ticket-config';

import Carousel from './DetailComponent/CarouselDu/Carousel';
import BreadCrumb from './BreadCrumbZheng/BreadCrumb';
// import BreadCrumb from './Breadcrumb/Breadcrumb';
import Rate from '../ticket/DetailComponent/Rate/Rate';
import IconBar from './DetailComponent/IconBar/IconBar';
import ShowPic from '../ticket/DetailComponent/ShowPic/ShowPic';
import HotelNotice from '../../product/ticket/DetailComponent/HotelNotice/HotelNotice';
import HotelDetail from '../ticket/DetailComponent/HotelDetail/HotelDetail';
import Comment from './DetailComponent/Comment/Comment';
import MapButton from '../stays/MapButton/MapButton';
import CommentSelector from '../ticket/DetailComponent/Comment/CommentSelector';
import BottomBar from '../stays/BottomBar/BottomBar';
import MobileFooter from '../stays/MobileFooter/MobileFooter';
import HashChange from './DetailComponent/HashChange/HashChange';
import ComputerLikeAdd from './DetailComponent/ComputerLikeAdd/ComputerLikeAdd';
import ComDatePicker from '../../product/ticket/DetailComponent/ComDatePicker/ComDatePicker';
import BookingBar from '../../product/ticket/DetailComponent/BookingBar/BookingBar';
import { useLocation } from 'react-router-dom';

function Ticket() {
  // const dataFrom = '14';
  const dataFrom = window.location.pathname.split('ticket/detail/')[1];
  // console.log("see dataForm:",dataFrom);
  const {
    hotelRoomChoose,
    setHotelRoomChoose,
    setHotelCommentData,
  } = useHotelContext();
  const {
    ticketCounts,
    ticketTypePrice,
    setTicketTypePrice,
    ticketListData,
    setTicketListData,
    setTicketCommentData,
    like,
    setLike,
    add,
    setAdd,
  } = useTicketContext();
 
  // const toggleLike = () => setLike(!like);
  // const toggleAdd = () => setAdd(!add);
 
  async function getHotelDetail() {
    //  ??????????????????
    const res_ticketListData = await axios.get(TICKET_DETAIL + dataFrom);
    // console.log(res_ticketListData);
    setTicketListData(res_ticketListData.data);

    // ?????????&??????
    const res_ticketType = await axios.get(TICKET_DETAIL + dataFrom + '/types');
    const myArray = res_ticketType.data;
    setHotelRoomChoose(myArray);
    // console.log(res_ticketType);
    //  ??????????????????
    setTicketTypePrice(myArray[0].product_price);

    // ?????????????????????test
    const res_ticketCommentData = await axios.get(
      TICKET_DETAIL + dataFrom + '/ticketComment'
    );
    setHotelCommentData(res_ticketCommentData.data);
    // console.log(res_ticketCommentData.data);
  }
  const Hotel_part0 = useRef();
  const Hotel_part1 = useRef();
  const Hotel_part2 = useRef();
  const Hotel_part3 = useRef();
  const Hotel_part4 = useRef();
  const Hotel_part5 = useRef();
  const [allPart, setAllPart] = useState({});
  const [isScroll, setIsScroll] = useState(false);
  window.addEventListener('scroll', () => {
    if (isScroll === false) {
      setIsScroll(true);
    }
  });
  useEffect(() => {
    getHotelDetail();

    if (isScroll) {
      let part0 = Hotel_part0.current.offsetTop;
      let part1 = Hotel_part1.current.offsetTop;
      let part2 = Hotel_part2.current.offsetTop;
      let part3 = Hotel_part3.current.offsetTop;
      let part4 = Hotel_part4.current.offsetTop;
      let part5 = Hotel_part5.current.offsetTop;
      // console.log(part0, part1, part2, part3, part4);
      setAllPart({
        part0: part0,
        part1: part1,
        part2: part2,
        part3: part3,
        part4: part4,
        part5: part5,
        bodyOffsetY: document.body.offsetHeight,
      });
    }
    // let part1 = Hotel_part1.current.offsetTop;
    // let part2 = Hotel_part2.current.offsetTop;
    // let part3 = Hotel_part3.current.offsetTop;
    // let part4 = Hotel_part4.current.offsetTop;
    // console.log(document.body.offsetHeight);
    // console.log(part1, part2, part3, part4); // 787 2478 4260 4761
    // setAllPart({
    // 	part1: part1,
    // 	part2: part2,
    // 	part3: part3,
    // 	part4: part4,
    // 	bodyOffsetY: document.body.offsetHeight,
    // });
  }, [isScroll]);
  return (
    <>
      <NavBar />
      <div className="MobileHidden">
        <BookingBar />
      </div>
      <div style={{ width: '100%', height: '79px' }}></div>
      <BottomBar />
      <div ref={Hotel_part0} id="Hotel_part0"></div>
      <div className="MobileHidden container">
        <BreadCrumb ticketData={ticketListData} />
      </div>
      <div className="container ticket_carousel">
        <Carousel />
      </div>
      <div className="ComputerHidden">
        <HashChange allPart={allPart} />
      </div>
      <div style={{ width: '100%', height: '79px' }}></div>
      <div className="container">
        <div className="">
          <div className="d-flex">
            <div className="Hotel_part0 Hotel_partHidden"></div>
            <div className="Hotel_part0_left">
              <div className="ComputerHidden"></div>

              <h2 style={{ color: '#4D4D4D', marginBottom: '20px' }}>
                {ticketListData.product_name}
              </h2>
              <Rate />
              <IconBar
                ticketListDataArea={ticketListData.area_name}
                ticketListDataCategories={ticketListData.classname}
              />
              <h4
                className="ComputerHidden"
                style={{
                  color: '#59d8a1',
                  fontSize: '22px',
                  marginBottom: '30px',
                }}
              >
                TWD${ticketCounts * ticketTypePrice}
              </h4>
            </div>
            <div className="Hotel_part0_right MobileHidden">
              <div className="Hotel_part0_right_icon d-flex ">
                <ComputerLikeAdd />
              </div>
            </div>
          </div>
          <div className="">
            <div className="MobileHidden givePadding">
              <ComDatePicker ticketType={hotelRoomChoose} />
            </div>
          </div>
          <div
            className="Hotel_partHidden"
            id="Hotel_part1"
            ref={Hotel_part1}
          ></div>
          <div className="d-flex" style={{ width: '100%' }}>
            <div className=" col-lg-8" style={{ marginRight: 'auto' }}>
              <h2 style={{ color: '#4D4D4D', margin: '40px 0px' }}>????????????</h2>
              <ShowPic />
              <div
                className="Hotel_partHidden"
                id="Hotel_part2"
                ref={Hotel_part2}
              ></div>
              <h2 style={{ color: '#4D4D4D', margin: '40px 0px' }}>????????????</h2>
              <HotelNotice />
              <div
                className="Hotel_partHidden"
                id="Hotel_part3"
                ref={Hotel_part3}
              ></div>
              <h2 style={{ color: '#4D4D4D', margin: '40px 0px' }}>????????????</h2>
              <HotelDetail />
              <MapButton />
              <div
                className="Hotel_partHidden"
                id="Hotel_part4"
                ref={Hotel_part4}
              ></div>
              <div className="d-flex" style={{ alignItems: 'center' }}>
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
              <Comment />
            </div>
            <div className="col-lg-3  MobileHidden ">
              <HashChange allPart={allPart} />
            </div>
          </div>
          <div
            className="Hotel_partHidden"
            id="Hotel_part5"
            ref={Hotel_part5}
          ></div>
        </div>
      </div>
      {/* <div
        className="HashChangeStop"
        style={{ width: '100%', outline: 'red 1px solid' }}
      ></div> */}
      <div className="ComputerHidden">
        <MobileFooter />
        <div
          style={{
            height: '120px',
            width: '100%',
            backgroundColor: '#aeaeae',
          }}
        ></div>
      </div>
      <div className="MobileHidden">
        <Footer />
      </div>
    </>
  );
}

export default Ticket;
