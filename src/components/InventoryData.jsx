import React, { useState, useEffect } from 'react';
import { Modal, Label, PrimaryButton, DefaultButton } from '@fluentui/react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/InventoryData.module.css';

const InventoryData = () => {
    const [inventory, setInventory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Form states for inventory inputs
    const [date, setDate] = useState('');
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');


    // Error states for validation
    const [errors, setErrors] = useState({});
    const formatDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString();
        return formattedDate;
    };

    const [sortOrder, setSortOrder] = useState({
        date: 'asc',
        itemName: 'asc',
        quantity: 'asc',
        category: 'asc',
    });

    const navigate = useNavigate();

    const sortDates = () => {
        setSortOrder((prevState) => {
            const newOrder = prevState.date === 'asc' ? 'desc' : 'asc';
            // Sort the inventory based on date
            setInventory((prevInventory) =>
                prevInventory.sort((a, b) =>
                    newOrder === 'asc'
                        ? new Date(a.date) - new Date(b.date)
                        : new Date(b.date) - new Date(a.date)
                )
            );
            return { ...prevState, date: newOrder };
        });
    };

    const sortItems = () => {
        setSortOrder((prevState) => {
            const newOrder = prevState.itemName === 'asc' ? 'desc' : 'asc';
            setInventory((prevInventory) =>
                prevInventory.sort((a, b) =>
                    newOrder === 'asc'
                        ? a.itemName.localeCompare(b.itemName)
                        : b.itemName.localeCompare(a.itemName)
                )
            );
            return { ...prevState, itemName: newOrder };
        });
    };

    const sortQuantities = () => {
        setSortOrder((prevState) => {
            const newOrder = prevState.quantity === 'asc' ? 'desc' : 'asc';
            setInventory((prevInventory) =>
                prevInventory.sort((a, b) =>
                    newOrder === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity
                )
            );
            return { ...prevState, quantity: newOrder };
        });
    };

    const sortCategories = () => {
        setSortOrder((prevState) => {
            const newOrder = prevState.category === 'asc' ? 'desc' : 'asc';
            setInventory((prevInventory) =>
                prevInventory.sort((a, b) =>
                    newOrder === 'asc'
                        ? a.category.localeCompare(b.category)
                        : b.category.localeCompare(a.category)
                )
            );
            return { ...prevState, category: newOrder };
        });
    };



    const categoryOptions = [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Cloths', label: 'Cloths' },
    ];

    const unitOptions = [
        { value: 'Kilograms', label: 'Kilograms' },
        { value: 'Liters', label: 'Liters' },
        { value: 'Units', label: 'Units' },
    ];

    // Fetch inventory data on initial render and after any operation
    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:8085/getInventory');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Toggle Modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openUpdateModal = (item) => {
        setSelectedItem(item);
        setDate(item.date);
        setItemName(item.itemName);
        setQuantity(item.quantity);
        setCategory(item.category);
        setUnitOfMeasurement(item.unitOfMeasurement);
        setDescription(item.description);
        setIsUpdateModalOpen(true);
    };
    const closeUpdateModal = () => setIsUpdateModalOpen(false);

    // Handle input changes
    const handleChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };

    // Handle form submission for adding inventory
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const newItem = {
                    date, itemName, quantity, category, unitOfMeasurement, description
                };
                await axios.post('http://localhost:8085/createInventory', newItem);
                fetchInventory();  // Fetch updated inventory
                resetForm();
                closeModal();
            } catch (error) {
                console.error('Error adding inventory:', error);
            }
        }
    };

    // Handle form submission for updating inventory
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const updatedItem = {
                    date, itemName, quantity, category, unitOfMeasurement, description
                };
                await axios.put(`http://localhost:8085/updateInventory/${selectedItem.id}`, updatedItem);
                fetchInventory();  // Fetch updated inventory
                closeUpdateModal();
            } catch (error) {
                console.error('Error updating inventory:', error);
            }
        }
    };

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};

        if (!date) newErrors.date = 'Date is required';
        if (!itemName) newErrors.itemName = 'Item Name is required';
        if (!quantity) newErrors.quantity = 'Quantity is required';
        if (!category) newErrors.category = 'Category is required';
        if (!unitOfMeasurement) newErrors.unitOfMeasurement = 'Unit of Measurement is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Reset form fields
    const resetForm = () => {
        setDate('');
        setItemName('');
        setQuantity('');
        setCategory('');
        setUnitOfMeasurement('');
        setDescription('');
    };

    // Handle delete functionality
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8085/deleteInventory/${id}`);
                fetchInventory();  // Fetch updated inventory
            } catch (error) {
                console.error('Error deleting inventory:', error);
            }
        }
    };
    const goToHomepage = () => {
        navigate('/homepage1');
    };

    return (
        <div className={styles.main_container}>
            <div className={styles.data_container}>

                <h1 className={styles.inventoryHeader}>Inventory Data</h1>
                <button onClick={openModal} className={styles.addInventoryButton} >ADD INVENTORY</button>
                <br></br>

                <div className={styles.inventory_table_Container}>
                    <div className={styles.scrollableTableContainer}>
                        <table className={styles.inventory_table}>
                            <thead>
                                <tr>
                                    <th className={styles.tableHeader}>
                                        Date
                                        {sortOrder.date === 'asc' ? (
                                            <ArrowDropDownIcon onClick={sortDates} className={styles.sortIcon} />
                                        ) : (
                                            <ArrowDropUpIcon onClick={sortDates} className={styles.sortIcon} />
                                        )}
                                    </th>
                                    <th className={styles.tableHeader}>
                                        Item Name
                                        {sortOrder.itemName === 'asc' ? (
                                            <ArrowDropDownIcon onClick={sortItems} className={styles.sortIcon} />
                                        ) : (
                                            <ArrowDropUpIcon onClick={sortItems} className={styles.sortIcon} />
                                        )}
                                    </th>
                                    <th className={styles.tableHeader}>
                                        Quantity
                                        {sortOrder.quantity === 'asc' ? (
                                            <ArrowDropDownIcon onClick={sortQuantities} className={styles.sortIcon} />
                                        ) : (
                                            <ArrowDropUpIcon onClick={sortQuantities} className={styles.sortIcon} />
                                        )}
                                    </th>
                                    <th className={styles.tableHeader}>
                                        Category
                                        {sortOrder.category === 'asc' ? (
                                            <ArrowDropDownIcon onClick={sortCategories} className={styles.sortIcon} />
                                        ) : (
                                            <ArrowDropUpIcon onClick={sortCategories} className={styles.sortIcon} />
                                        )}
                                    </th>
                                    <th className={styles.tableHeader}>Unit</th>
                                    <th className={styles.tableHeader}>Description</th>
                                    <th className={styles.tableHeader}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item) => (
                                    <tr key={item.id}>
                                        <td>{formatDate(item.date)}</td>
                                        <td>{item.itemName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.category}</td>
                                        <td>{item.unitOfMeasurement}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <div className={styles.actionIcons}>
                                                <DeleteIcon onClick={() => handleDelete(item.id)} />
                                                <EditIcon style={{ marginLeft: '10px' }} onClick={() => openUpdateModal(item)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


               

                {/* Add Inventory Modal */}
                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onDismiss={closeModal}>
                        <div className={styles.inventoryModalWrapper}>
                            <h2 className={styles.inventoryModalHeading}>Add Inventory Data</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Date</Label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={handleChange(setDate, 'date')}
                                        className={errors.date ? styles.inputError : ''}
                                    />
                                    {errors.date && <div className={styles.inventoryFormError}>{errors.date}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Item Name</Label>
                                    <input
                                        placeholder="Enter item name"
                                        type="text"
                                        value={itemName}
                                        onChange={handleChange(setItemName, 'itemName')}
                                        className={errors.itemName ? styles.inputError : ''}
                                    />
                                    {errors.itemName && <div className={styles.inventoryFormError}>{errors.itemName}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Quantity</Label>
                                    <input
                                        placeholder="Enter quantity"
                                        type="text"
                                        value={quantity}
                                        onChange={handleChange(setQuantity, 'quantity')}
                                        className={errors.quantity ? styles.inputError : ''}
                                    />
                                    {errors.quantity && <div className={styles.inventoryFormError}>{errors.quantity}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Category</Label>
                                    <select
                                        value={category}
                                        onChange={handleChange(setCategory, 'category')}
                                        className={errors.category ? styles.inputError : ''}
                                    >
                                        <option value="">Select category</option>
                                        {categoryOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    {errors.category && <div className={styles.inventoryFormError}>{errors.category}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Unit of Measurement</Label>
                                    <select
                                        value={unitOfMeasurement}
                                        onChange={handleChange(setUnitOfMeasurement, 'unitOfMeasurement')}
                                        className={errors.unitOfMeasurement ? styles.inputError : ''}
                                    >
                                        <option value="">Select unit</option>
                                        {unitOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    {errors.unitOfMeasurement && <div className={styles.inventoryFormError}>{errors.unitOfMeasurement}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Description</Label>
                                    <textarea
                                        value={description}
                                        onChange={handleChange(setDescription, 'description')}
                                    />
                                </div>
                                <div className={styles.inventoryFormActions}>

                                    <button onClick={closeModal} className={styles.cancelButton}>CANCEL</button>
                                    <button type="submit" className={styles.saveButton}>ADD</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )}

                {isUpdateModalOpen && (
                    <Modal isOpen={isUpdateModalOpen} onDismiss={closeUpdateModal}>
                        <div className={styles.inventoryModalWrapper}>
                            <h2 className={styles.inventoryModalHeading}>Update Inventory Data</h2>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Date</Label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={handleChange(setDate, 'date')}
                                        className={errors.date ? styles.inputError : ''}
                                    />
                                    {errors.date && <div className={styles.inventoryFormError}>{errors.date}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Item Name</Label>
                                    <input
                                        type="text"
                                        value={itemName}
                                        onChange={handleChange(setItemName, 'itemName')}
                                        className={errors.itemName ? styles.inputError : ''}
                                    />
                                    {errors.itemName && <div className={styles.inventoryFormError}>{errors.itemName}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Quantity</Label>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={handleChange(setQuantity, 'quantity')}
                                        className={errors.quantity ? styles.inputError : ''}
                                    />
                                    {errors.quantity && <div className={styles.inventoryFormError}>{errors.quantity}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Category</Label>
                                    <select
                                        value={category}
                                        onChange={handleChange(setCategory, 'category')}
                                        className={errors.category ? styles.inputError : ''}
                                    >
                                        <option value="">Select category</option>
                                        {categoryOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    {errors.category && <div className={styles.inventoryFormError}>{errors.category}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Unit of Measurement</Label>
                                    <select
                                        value={unitOfMeasurement}
                                        onChange={handleChange(setUnitOfMeasurement, 'unitOfMeasurement')}
                                        className={errors.unitOfMeasurement ? styles.inputError : ''}
                                    >
                                        <option value="">Select unit</option>
                                        {unitOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    {errors.unitOfMeasurement && <div className={styles.inventoryFormError}>{errors.unitOfMeasurement}</div>}
                                </div>
                                <div className={styles.inventoryFormGroup}>
                                    <Label>Description</Label>
                                    <textarea
                                        value={description}
                                        onChange={handleChange(setDescription, 'description')}
                                    />
                                </div>
                                <div className={styles.inventoryFormActions}>
                                    <button className={styles.cancelButton} onClick={closeUpdateModal}>CANCEL</button>
                                    <button className={styles.saveButton} type="submit">UPDATE</button>

                                </div>
                            </form>
                        </div>
                    </Modal>
                )}


            </div>


        </div>
    );
};

export default InventoryData;
