import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CategoryForm from './Form'

class AddCategory extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            submitLoading: false,
            errors: {
                name: ''
            }
        }
    }

    componentDidMount(){
        document.title = "Add Category"
    }

    handleSubmit = (formData) => {
        this.setState(() => ({
            submitLoading: true
        }))
        const token = localStorage.getItem('token')
        axios.post("http://localhost:3005/admin/categories", formData, {
                headers: {
                    'x-auth': token
                }
            })
            .then(res => {
                console.log(res.data)
                if(res.data.errors){
                    this.setState(() => ({
                        errors: res.data.errors,
                        submitLoading: false
                    }))
                }else{
                    this.props.history.push('/admin/categories')
                }
            })
            .catch(err => {
                console.log('error',err)
            })
    }

    render(){
        return (
            <div className="expenses">
                <div className="headTitle">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <h1>Add Category</h1>
                                </div>
                                <div className="col-md-6">
                                    <div className="rightBtn">
                                        <Link to="/admin/categories">Go Back</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="container">
                    <CategoryForm title="Add" 
                              handleSubmit={this.handleSubmit}
                              submitLoading={this.state.submitLoading} 
                              errors={this.state.errors}
                    />
                </div>
            </div>
        )
    }
}

export default AddCategory