import React from "react";
import './Landing.css';


function HomeSection({
    bg,
    header,
    content,
    pic,
    imgStart,
    alt,
}){
    return(
        <> 
            <div className={bg}>
                <div className="container">
                    <div className="row" style={{
                        display: 'flex',
                        flexDirection: imgStart === 'start' ? 'row-reverse':'row'
                    }}>
                        <div className="blank"/>
                        <div className="col">
                            <div className="text-wrapper">
                                <h1 className="home">{header}</h1>
                                <div className="blank"/>
                                <div className="content">{content}</div>	
                            </div>
                        </div>
                        <div className="col">
                            <div className="img-wrapper">
                                <img src={pic} alt={alt} className="sec-img"/>
                            </div>
                        </div>
                        <div className="blank"/>
                        <div className="blank"/>
                        <div className="blank"/>
                    </div>
                </div>
            </div>

        </>
    )
}

export default HomeSection;