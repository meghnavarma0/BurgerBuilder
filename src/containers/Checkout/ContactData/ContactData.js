import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidation } from '../../../shared/utility';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',

					placeholder: 'Your Name'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',

					placeholder: 'Street'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',

					placeholder: 'ZIP CODE'
				},
				value: '',
				validation: {
					required: true,
					minLength: 5,
					maxLength: 9,
					isNumeric: true
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',

					placeholder: 'Country'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',

					placeholder: 'Your E-Mail'
				},
				value: '',
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' }
					]
				},
				value: 'fastest',
				validation: {},
				valid: true
			}
		},
		formIsValid: false
	};
	orderHandler = event => {
		event.preventDefault();
		this.setState({ loading: true });
		let formData = {};
		for (let dataIdentifier in this.state.orderForm) {
			formData[dataIdentifier] = this.state.orderForm[
				dataIdentifier
			].value;
		}
		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			contactData: formData,
			userId: this.props.userId
		};
		alert('You Continue!');

		this.props.onOrderBurger(order, this.props.token);
	};

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedFormElement = updateObject(
			this.state.orderForm[inputIdentifier],
			{
				value: event.target.value,
				valid: checkValidation(
					event.target.value,
					this.state.orderForm[inputIdentifier].validation
				),
				touched: true
			}
		);
		const updatedOrderForm = updateObject(this.state.orderForm, {
			[inputIdentifier]: updatedFormElement
		});

		let formIsValid = true;
		for (let formIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[formIdentifier].valid && formIsValid;
		}
		this.setState({
			orderForm: updatedOrderForm,
			formIsValid: formIsValid
		});
		// console.log(event.target.value);
	};
	render() {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}
		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map(formElement => (
					<Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						touched={formElement.config.touched}
						shouldValidate={formElement.config.validation}
						changed={event =>
							this.inputChangedHandler(event, formElement.id)
						}
					/>
				))}
				<Button btnType='Success' disabled={!this.state.formIsValid}>
					ORDER
				</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />;
		}
		return (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(actions.purchaseBurger(orderData, token))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios));
