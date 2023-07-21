import React,{useState,useEffect} from 'react'
import {Select,Button,Avatar,Badge} from 'antd'
import {SaveOutlined} from '@ant-design/icons'

const {Option}=Select

const CourseCreateForm = ({handleSubmit,handleChange,handleImage,values,setValues,preview,uploadButtonText,handleImageRemove,editPage=false}) => {
    //for adjusting the all pricing range
    const children=[]
    for(let i=9.99;i<=100.99;i++){
        children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>)
    }
  return (
    <>
     {values && (
        <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <input 
                type='text'
                name='name'
                className='form-control'
                placeholder='Name'
                onChange={handleChange}
                value={values.name} 
            />
        </div>
        <div className='form-group pt-3'>
            <textarea
                name='description'
                cols='7'
                rows='7'
                className='form-control'
                placeholder='Description'
                onChange={handleChange}
                value={values.description} 
            ></textarea> 
        </div>

        <div className='form-row pt-3'>
            <div className='col'>
                <div className='form-group'>
                    <Select
                    style={{width:'100%'}}
                    size='large'
                    value={values.paid}
                    onChange={(v)=>setValues({...values,paid: v,price: 0})}>
                        <Option value={true}>Paid</Option>
                        <Option value={false}>Free</Option>
                    </Select>
                </div>
            </div>
            {values.paid && (
                <div className='col-md-6 pt-3'>
                    <div className='form-group'>
                        <Select
                        defaultValue='$9.99'
                        style={{width:'100%'}}
                        onChange={(v)=>setValues({...values,price:v})}
                        tokenSeparators={[',']}
                        size='large'
                        >
                            {children}
                        </Select>
                    </div>
                </div>
            )}
        </div>

        <div className='form-group pt-3'>
            <input 
                type='text'
                name='category'
                className='form-control'
                placeholder='Category'
                onChange={handleChange}
                value={values.category} 
            />
        </div>

        <div className='form-row pt-3'>
            <div className='col'>
                <div className='form-group'>
                    <label className='btn btn-outline-secondary btn-block text-left'>
                        {uploadButtonText}
                        <input type='file' name='image' onChange={handleImage}  accept='image/*' hidden/>
                    </label>
                </div>
            </div>
            {/* for seeing the preview */}
            {preview && (
                <div className='col-md-6 pt-3'>
                    <Badge count='X' onClick={handleImageRemove} className='pointer'>
                        <Avatar width={200} src={preview} />
                    </Badge>
                </div>
            )}

            {editPage && values.image && (<Avatar width={200} className='mt-2' src={values.image.Location} />)}

        </div>

        <div className='row pt-3'>
            <div className='col'>
                <Button
                 onClick={handleSubmit}
                 disabled={values.loading || values.uploading}
                 className='btn btn-primary'
                 loading={values.loading}
                 type='primary'
                 size='large'
                 shape='round'
                >
                    {values.loading?'Saving...':'Save & Continue'}
                </Button>
            </div>
        </div>
    </form>
     )}
    </>
  )
}

export default CourseCreateForm