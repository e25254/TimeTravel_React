import React from 'react';
import { Rate } from 'antd';
import './Comment.scss';
import moment from 'moment/moment';
import { useHotelContext } from '../../../stays/Context/HotelContext';
function CommentCard() {
  const { hotelCommentData } = useHotelContext();
  console.log(hotelCommentData);
  return (
    <>
      {hotelCommentData.map((v, i) => {
        return (
          <div className="Comment_Bottom" key={i}>
            <div>
              <div className="d-flex Comment_Card">
                <div className="Comment_userPic"></div>
                <div className="Comment_userName">
                  <h2>{v.username}</h2>
                  <Rate
                    disabled
                    value={v.score}
                    className="TimeTravel_Rate"
                    style={{ zIndex: -1 }}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div style={{ color: '#8A8A8A' }}>
                    {moment(v.create_time).format('YYYY-MM-DD')}
                  </div>
                </div>
              </div>
              <div className="Comment_text">{v.commit_text}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default CommentCard;
