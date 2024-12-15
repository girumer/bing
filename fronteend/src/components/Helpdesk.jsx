import React from 'react'
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa'; 
import { AiOutlineComment } from 'react-icons/ai'; 
import Navbar from '../components/Navbar';
import './Helpdesk.css';
function Helpdesk() {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [visible, setVisible] = useState([false, false, false]);

    const paragraphs = [
      "ቢንጎ ለመጫወት የሚገቡ ተጫዋቾች  መጫወት እስኪጀምሩ ድረስ 50 ወደታች ይቆጥራል እሰከ ዜሮ ይቆጥራል ዘሮ ከደራሰ በኋላ ጨዋታው ስለሚጀምር  እና መግባት ስለማይቻል የተጀመረው ጨዋታ እሰኪያልቅ ጠብቁ  ማለት ነው፡፡",
      "የሚጠሩትን ቁጥሮች በእርስዎ ካርድ ላይ እየነኩ ሄደው ከአምስቱ ቀጥታ ያለውን አግድም ማስምር ፣ ቋሚ መስመር ፣ ዲጎናል  አንድ መስመር ወይም 4ኮርነር ከሰሩ አሸናፊ ይሆናሉ።",
      "ካላይ በተራ ቁጥር ሁለት ካሉት አንዱን ያሟላና ቀድሞ ቢነጎ ሚለውን ማስፈንጠርያ የነካ አንድ ሰው አሸናፊ ይሆናል ",
      "አንድ ተጫዋች ጨዋታውን  ቢሸነፍም  አንድ ነጥብ ይሰጠዋል  ጨዋታውን ካሸነፈ አንድ ተጨማሪ ነጥብ ይሰጠዋል ያ ማለት ሁለት ነጥብ ይኖረዋል ፡፡ አንድ ነጥብ አንድ ብርን ይወክላል ይህን ነጥብ ወደብር ለመለወጥ አስር ነጥብ መድረስ አለበት "
    ];
  
    const toggleVisibility = (index) => {
      const updatedVisibility = [...visible];
      updatedVisibility[index] = !updatedVisibility[index];
      setVisible(updatedVisibility);
    };
  
    return (
        <React.Fragment>
    <Navbar />
      <div className="containers">
        <h1 className="title">ስለ ቢንጎ አጨዋወት  ጠቅለል ያለ መረጃ</h1>
        <div className="button-container">
          {['ካርቴላ ልንመርጥ ስንል Active Game 1 ሲያጋጥመን ምን ማለት ነው ', 'እንዴት ማሸነፍ ይቻላል?', 'ስንት  አሸናፊ ይኖራል?','ሰለኮይን እና አጣቃቀሙ'].map((buttonText, index) => (
            <div key={index}>
              <button className="button" onClick={() => toggleVisibility(index)}>
               <AiOutlineComment style={{ marginRight: '10px' }} /> {buttonText} <span className="icon">+</span>
              </button>
              {visible[index] && <p className="paragraph">{paragraphs[index]}</p>}
            </div>
          ))}
        </div>
      </div>
      </React.Fragment>
      );
}

export default Helpdesk