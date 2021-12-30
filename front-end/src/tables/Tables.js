import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import TablesForm from "./TablesForm";

/**
 * Defines Tables component
 * Allows you to create a new table. After adding a new table, returns to Dashboard
 */

function Tables() {
	// default initial state
	const initialState = {
		table_name: "",
		capacity: "",
		status: "free",
	};
	const [formData, setFormData] = useState({ ...initialState });

	const history = useHistory();

	// submit handler
	const handleSubmit = (e) => {
		e.preventDefault();
		const abortController = new AbortController();

		async function updateData() {
			try {
				await createTable(formData, abortController.signal);
				history.push(`/dashboard`);
			} catch (error) {
				if (error.name === "AbortError") {
					console.log("Aborted");
				} else {
					throw error;
				}
			}
		}
		updateData();
		return () => {
			abortController.abort();
		};
	};

	// form change handler

	const handleChange = ({ target }) => {
		let value = target.value;

		if (target.name === "capacity" && target.value <= 0) {
			value = 1;
		}

		setFormData({ ...formData, [target.name]: value });
	};

	return (
		<main>
			<h1>Tables</h1>

			<form onSubmit={handleSubmit}>
				<TablesForm formData={formData} handleChange={handleChange} />
				<button
					type="button"
					onClick={() => history.goBack()}
					className="btn btn-secondary"
				>
					Cancel
				</button>{" "}
				&nbsp;
				<button
					type="submit"
					className="btn btn-primary"
					disabled={formData.table_name.length < 2}
				>
					Save
				</button>
			</form>
		</main>
	);
}

export default Tables;
