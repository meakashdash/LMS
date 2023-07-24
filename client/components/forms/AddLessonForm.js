import {useState} from 'react';
import axios from 'axios';
import {Button,Progress, Tooltip,Checkbox} from 'antd';
import {CloseCircleFilled} from '@ant-design/icons';




const AddLessonForm=({values,setValues,handleAddLesson,uploading,uploadButtonText,handleVideo,progress,handleRemoveVideo})=>{
    return (
        <>
            <form >
                <input
                    type='text'
                    className='form-control square'
                    onChange={(e)=>setValues({...values,title:e.target.value})}
                    value={values.title}
                    placeholder='Title'
                    autoFocus
                    required
                />

                <textarea
                    className='form-control mt-3'
                    cols='7'
                    rows='7'
                    onChange={(e)=>setValues({...values,content:e.target.value})}
                    value={values.content}
                    placeholder='Content'
                ></textarea>

                <div className='d-flex justify-content-center'>
                    <label className='btn btn-dark btn-block text-left mt-3'>
                        {uploadButtonText}
                        <input onChange={handleVideo} type='file' accept='video/*' hidden/>
                    </label>

                    {!uploading && values.video.Location && (
                        <Tooltip title='Remove'>
                            <span onClick={handleRemoveVideo} className='pt-1 pl-3'>
                                <CloseCircleFilled className='text-danger d-flex justify-content-center pt-4 pointer' />
                            </span>
                        </Tooltip>
                    )}
                </div>

                <div className='form-check mt-3'>
                    <Checkbox
                        checked={values.free_preview}
                        onChange={(e) => setValues({ ...values, free_preview: e.target.checked })}
                        className='form-check-input'
                    >
                    Free Preview
                    </Checkbox>
                </div>

                {progress>0 && (
                    <Progress
                    className='d-flex justify-content-center pt-2'	
                    percent={progress}
                    steps={10}
                    />
                )}

                <br />
                <Button onClick={handleAddLesson} className='col mt-3' size='large' type='primary' loading={uploading} shape='round'>Save</Button>
            </form>
        </>
    )
}

export default AddLessonForm;