import React from 'react'

class EmployeeForm extends React.Component{
    constructor(props){
        super(props)
        const expense = props.expense.colleagues.find(colleague => colleague.user._id === localStorage.getItem('id'))
        this.state = {
            amountSpent: expense.amountSpent,
            receipt: expense.receipt,
            receiptImg: expense.receipt
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('receipt', this.state.receipt ? this.state.receipt : this.state.receiptImg)
        formData.append('amountSpent', this.state.amountSpent)
        this.props.handleSubmit(formData)
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    handleFileChange = (e) => {
        e.persist()
        this.setState(() => ({
            receipt: e.target.files[0]
        }))
    }

    render(){
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <div className="row">                                                         
                    <div className="col-md-3">
                        <label className="label">Amount Spent</label>
                    </div>
                    <div className="col-md-4">
                        <input type="text" 
                            className="form-control field" 
                            placeholder="Enter Amount Spent" 
                            name="amountSpent" 
                            value={this.state.amountSpent} 
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="col-md-5">
                        
                    </div>
                    <div className="col-md-3">
                        <label className="label">Receipt</label>
                    </div>
                    <div className="col-md-4">
                        <input type="file" 
                               className="form-control field"
                               name="receipt" 
                               onChange={this.handleFileChange}
                        />
                        <div className="receiptImg">
                            { this.state.receiptImg != 'null' ? <img src={`http://localhost:3005/uploads/${this.state.receiptImg}`} alt={`${this.state.receiptImg}`} /> : '' }
                        </div>
                    </div>
                    <div className="col-md-5">
                        
                    </div>
                    <div className="col-md-3">

                    </div>
                    <div className="col-md-4">
                        <button className="btn">
                            { this.props.submitLoading ? <i className="fa fa-spin fa-spinner"></i> : 'Update Expense' }
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

export default EmployeeForm