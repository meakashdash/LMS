import {useState,useEffect} from 'react';
import {Modal} from 'antd';
import ReactPlayer from 'react-player';

const PreviewModal=({preview,visible,setVisible})=>{

    return(
        <>
        <Modal
            title="Course Preview"
            centered
            open={visible}
            onCancel={() => setVisible(!visible)}
            footer={null}
        >
            <div className='player-wrapper'>
                <ReactPlayer
                    url={preview}
                    playing={visible}
                    width={400}
                    height='200px'
                    controls={true}
                />
            </div>
        </Modal>
        </>
        
    )
}


export default PreviewModal;