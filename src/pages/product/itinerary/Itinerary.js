import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ITINERARY_LIST } from './site-config';

import NavBar from '../../../layout/NavBar';
import Footer from '../../../layout/Footer';
import SideBar from '../../../layout/SideBar';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Itinerary_Card_List from './Itinerary_Card_List';
import './Itinerary.scss';

function Itinerary() {
  const [iData, setIData] = useState([]);
  async function getList() {
    const response = await axios.get(ITINERARY_LIST);
    setIData(response.data);
  }
  const location = useLocation();

  useEffect(() => {
    getList();
  }, [location]);

  return (
    <>
      <NavBar />
      <Container className="ispace">
        <Row className="rowmb">
          <SideBar />
          <Col className="col-9 g-4">
            <div className="d-flex justify-content-between">
              <div className="ititlerow">
                <h1 className="titlespace-x">我的行程規劃</h1>
                <p>三個規劃</p>
              </div>
              <button type="button" className="btn btn-primary btnstyle">
                新增規劃
              </button>
            </div>
            <Itinerary_Card_List rows={iData} />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Itinerary;
