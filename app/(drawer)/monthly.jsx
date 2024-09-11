import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  FlatList,
  LogBox,
} from 'react-native';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';



import { Colors } from '@/constants/Colors';
import background from "@/assets/images/Bottom_Background.png"
import CustomInput from '@/components/CustomInput';
import Loading from '@/components/Loading';
import Banner from '@/components/Banner';

// React-Hook-Form
import { useForm } from 'react-hook-form';
import { router, useNavigation } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setMonthly, setTransactions, setWeekly, setYearly } from '@/context/slices/user_transactions';
import { setCurrentMonthTrans, setPastMonths } from '@/context/slices/user_years';

// Firebase Database
import { db, transactionRef } from '@/config/firebase';
import { addDoc, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import InfoBox from '@/components/infoBox';
import ListBox from '@/components/listBox';


export default function Monthly () {

    // LogBox.ignoreAllLogs();

    const navigation = useNavigation();

/*************************************************************************************/
//                      Variables/States for the Monthly tab
/*************************************************************************************/

    // Variable to tell if the page is in focus
    const isFocused = useIsFocused();

    // Using React-Hook-Form to help handle input errors and data
    const {control, handleSubmit} = useForm();

    // Variable for when the submit button is pressed within a modal
    const [loading, setLoading] = useState(false);


    // List of the month names
    const months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];

    


    // Getting global redux states
    const {user} = useSelector(state => state.user);
    const {transactions, monthly, yearly} = useSelector(state => state.persistTransaction)
    const {currentMonthTrans, pastMonths} = useSelector(state => state.persistedReducer)
    const dispatch = useDispatch();

    



    // States for adding incomes/expenses
    const [addIncomeVisible, setAddIncomeVisible] = useState(false);
    const [addExpenseVisible, setAddExpenseVisible] = useState(false);
    const addIncomePressed = () => {
        setAddIncomeVisible(true)
    }; 
    const addExpensePressed = () => {
        setAddExpenseVisible(true)
    };

    // States for the monthly page stats
    const [monthlyIncome, setMonthlyIncome] = useState(0.00)
    const [monthlyExpense, setMonthlyExpense] = useState(0.00)
    const [monthlyProfit, setMonthlyProfit] = useState(0.00)


    // States for the yearly page
    // const [nums, setNums] = useState([])
    // const [monthVals, setMonthVals] = useState([])
    // const [completeData, setCompleteData] = useState([])
    // const [yearlyIncome, setYearlyIncome] = useState(0)
    // const [yearlyProfit, setYearlyProfit] = useState(0)
    
    // States for the 'DropdownPicker'
    const [open, setOpen] = useState(false)
    const [budget, setBudget] = useState(null)
    const [items, setItems] = useState([
        {label: null, value: null},
        {label: 'Shopping', value: 'Shopping'},
        {label: 'Fuel', value: 'Fuel'},
        {label: 'Rent', value: 'Rent'},
        {label: 'Food & Drink', value: 'Food & Drink'},
        {label: 'Bills', value: 'Bills'},
        {label: 'Other', value: 'Other'}
    ])


    const budgetIcons = [
        {name: 'Shopping', icon: 'cart'},
        {name: 'Fuel', icon: 'car'},
        {name: 'Rent', icon: 'home'},
        {name: 'Food & Drink', icon: 'logo-apple'},
        {name: 'Bills', icon: 'cash'},
        {name: 'Other', icon: 'gift'}
    ]


    // This state and determines whether or not monthly transactions are shown
    const [showMonthly, setShowMonthly] = useState(false)
    const onShow = () => {
        setShowMonthly(true);
    }
    const onCancelShow = () => {
        setShowMonthly(false);
    }

    const [refresh, setRefresh] = useState(false)
    const onRefresh = () => {
        setRefresh(true)
        console.log("ref")
        // fetchTransaction();
        // fetchMonthly();
        // fetchStats();
        // fetchPastMonths();
        console.log(transactions, "\n", monthly, "\n", yearly, "\n", currentMonthTrans, "\n", pastMonths)
        setTimeout ( () => {
            setRefresh(false)
        }, 500)
        
    }
   

{/*******************************************************************/}
{/*         These are the interactions with the database            */}
{/*******************************************************************/}
   
    // Sends income information to firebase database
    const handleAddIncome = async (data) => {

        
        if (!(isNaN(data.amount))) {
            setLoading(true);
            try{
                let doc = await addDoc( transactionRef, {
                    amount: Number(data.amount),
                    name: "Income",
                    description: data.description,
                    date: Date(),
                    dayOfWeek: Number(new Date().getDay()),
                    dayOfMonth: Number(new Date().getDate()),
                    // month: Number(new Date().getMonth()),
                    month: 4,
                    userID: user.uid
                });
                setLoading(false);
                if(doc && doc.id){
                    setAddIncomeVisible(false)
                }
            }catch(err) {
                Alert.alert("Error:", "Something went wrong")
                setAddIncomeVisible(false)
                setLoading(false);
            }
        }else {
            Alert.alert("Error:", "Invalid number amount")
            setAddIncomeVisible(false)
        }
        
    }
 

    // Sends expense information to firebase database
    const handleAddExpense = async (data) => {
        if (!(isNaN(data.amount))) {
            const monthTotal = monthlyExpense;
            setLoading(true);
            try{
                let doc = await addDoc( transactionRef, {
                    amount: -Number(data.amount),
                    name: budget ? (budget):('Other'),
                    description: data.description,
                    date: Date(),
                    dayOfWeek: Number(new Date().getDay()),
                    dayOfMonth: Number(new Date().getDate()),
                    // month: Number(new Date().getMonth()),
                    month: 3,
                    year: Number(new Date().getFullYear()),
                    
                    userID: user.uid
                });
                setLoading(false);
                if(doc && doc.id){
                    setAddExpenseVisible(false)
                    
                }
            }catch(err) {
                console.log(err)
                Alert.alert("Error:", "Something went wrong")
                setAddExpenseVisible(false)
                setLoading(false);
            }
        }else {
            Alert.alert("Error:", "Invalid number amount")
            setAddExpenseVisible(false)
        }
    }

    // const fetchWeekly = () => {
        
    //     if(transactions.length > 0){
    //         let week = []
    //         console.log("In weekly")
    //         // Looks at the most recent transactions and puts all of the transactions from the current week in the 'weekly' array
    //         for(i=transactions.length-1; i >= 0; i--) {
    //             const currentTrans = transactions[i];
    //             if (i > 0) {
    //                 const nextTrans = transactions[i-1];
                    
    //                 const LDM = currentTrans.dayOfWeek - currentTrans.dayOfMonth
    //                 const diff1 = currentTrans.dayOfMonth - nextTrans.dayOfMonth

    //                 if ((currentTrans.month == nextTrans.month) && ((nextTrans.dayOfWeek <= currentTrans.dayOfWeek) && (diff1 < 7))) {
    //                     week.push(currentTrans)
    //                 }else if (((currentTrans.month == nextTrans.month+1) && (LDM > 0) && (nextTrans.dayOfWeek <= currentTrans.dayOfWeek))) {
    //                     week.push(currentTrans)
    //                 }else {
    //                     week.push(currentTrans)
    //                     break
    //                 }
    //             }else {
    //                 week.push(currentTrans)
    //             }
                
    //         }
    //         dispatch(setWeekly(week));
    //     }else {
    //         dispatch(setWeekly([]));
    //     }
    // }

    const fetchMonthly = () => {
        
        if(transactions.length > 0){
            let month = []
            console.log("In Monthly")
            // Looks at the most recent transactions and puts all of the transactions from the current month in the 'monthly' array
            for(i=transactions.length-1; i > -1; i--) {
                if(i > 0) {
                    if((transactions[i-1].month != transactions[i].month) || (transactions[i-1].dayOfMonth != 1 && transactions[i].dayOfMonth == 1)) {
                        month.push(transactions[i])
                        break
                    }else {
                        month.push(transactions[i])
                    }
                    
                }else {
                    month.push(transactions[i])
                    
                } 
            }

            dispatch(setMonthly(month))
        }else {
            dispatch(setMonthly(0));
            dispatch(setPastMonths([]));
            dispatch(setCurrentMonthTrans([]));
        }

    }
    const fetchStats = () => {
        
        if(transactions.length > 0) {
            let prof = 0
            let inc = 0
            let exp = 0
            console.log("In stats")
            // Goes through the monthly transactions and gathers the total profit, income, and expenses for the month
            for(i in monthly) {
                prof += monthly[i].amount
                if (monthly[i].amount > 0) {
                    inc += monthly[i].amount
                }else {
                    exp -= monthly[i].amount
                }
            }
            setMonthlyProfit(prof)        
            setMonthlyIncome(inc)
            setMonthlyExpense(exp)
        }else {
            setMonthlyProfit(0)        
            setMonthlyIncome(0)
            setMonthlyExpense(0)
        }
    }
    // const fetchYearly = () => {
    //     if(transactions.length > 0){
    //         console.log("In yearly");
    //         // console.log(pastMonths.length)
    //         if(pastMonths.length > 0) {
    //             let vals = [];
    //             let amt = [];
    //             let last = 0;
    //             //console.log(currentMonthTrans)
    //             let done = false;
    //             while(!done){
                    
    //                 amt.push(currentMonthTrans[0].amount)
    //                 vals.push(months[currentMonthTrans[0].month])
    //                 pastMonths.forEach((result) => {
    //                     vals.unshift(months[result.month])
    //                     amt.unshift(result.amount)
    //                     {vals.length > 6 && (done=true)}
    //                     last = result.month
    //                 })
                
    //                 setMonthVals(vals);
    //                 setNums(amt);
    //                 done=true
    //                 console.log(nums)
    //             }
                
    //             let newMonth = last - 1;
    //             console.log(newMonth, months[newMonth])
    //             while(newMonth > -1) {
                    
    //                 vals.unshift(months[newMonth]);
    //                 amt.unshift(0);
    //                 newMonth -= 1;
    //             }
                
    //         }else if(currentMonthTrans.length > 0) {
    //             let vals = [];
    //             let amt = [];
    //             let currMonth = currentMonthTrans[0].month;
    //             let currAmt = currentMonthTrans[0].amount;
    //             vals.push(months[currMonth]);
    //             amt.push(currAmt);

    //             let newMonth = currMonth -1;
    //             while(newMonth > -1) {
    //                 vals.push(months[newMonth]);
    //                 amt.push(0);
    //                 newMonth -= 1;
    //             }
    //             // console.log(amt)
    //             setMonthVals(vals.reverse());
    //             setNums(amt.reverse());
                
    //         };  
    //         // if(currentMonthTrans.length > 0) {
    //         //     setChartVisible(true)
    //         // }else {
    //         //     setChartVisible(false)
    //         // }
            
    //         let len = nums.length;
    //         let fullData = []
    //         let i=0
    //         while(i<len){
    //             fullData.push({label: monthVals[i], value: nums[i] })
    //             i += 1
    //         }
    //         if(fullData.length != 0) {
    //             console.log("Full", fullData)
    //             dispatch(setYearly(fullData));
    //         }
    //         console.log(yearly)
    //     }else {
    //         dispatch(setYearly([]));
    //     }
    // }


    // Retrieves transaction from the firebase database
    const fetchTransaction = async() => {
        console.log("in tran")
        const q = query(transactionRef, where("userID", "==", user.uid), orderBy('date', 'asc'));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let data = []
            querySnapshot.forEach(doc => {
                // console.log({...doc.data()})
                data.push({...doc.data(), })
            });
            // console.log("data", data);
            dispatch(setTransactions(data));
            console.log(transactions);
            setTimeout( () => {
                fetchMonthly();
                fetchStats();
                fetchPastMonths();
            }, 2000)
           
        })        
    };

    // Sorts through transactions and gathers information on the months of the year
    const fetchPastMonths = () => {
        // console.log(monthly)
        if (monthly.length > 0) {
            let past = []
            let currTrans = []

            let inc = 0
            let exp = 0
            let total = 0 
            for (i in monthly){
                tran = monthly[i]
                total += tran.amount
                if (tran.name == 'Income') {
                    inc += tran.amount
                }else {
                    exp += tran.amount
                }
            } 
            
            if(currentMonthTrans.length < 1 || monthly[0].month != currentMonthTrans[0].month){
                // New Month
                let saved = 0
                {
                    total > 0 ? 
                    (  saved = (total/inc)*100) : 
                    ( saved = (total/exp)*100)
                }
                
                currTrans.push({
                    income: inc,
                    amount: total,
                    saved: saved.toFixed(0),
                    month: monthly[0].month,
                })
                console.log(currTrans)
                if(currentMonthTrans.length > 0){
                    past.push(...currentMonthTrans)
                    let newest = []
                    newest.push(...past, ...pastMonths)
                    dispatch(setPastMonths(newest))
                }
                dispatch(setCurrentMonthTrans(currTrans))
                // console.log(currentMonthTrans)
                
            }else if(total != currentMonthTrans[0].amount || ((total/inc)*100).toFixed(0) != currentMonthTrans[0].saved || inc != currentMonthTrans[0].income) {
                // New transactions have been made
                console.log("Entered 2")
                currTrans.push({
                    income: inc,
                    amount: total,
                    saved: ((total/inc)*100).toFixed(0),
                    month: monthly[0].month,
                })
                dispatch(setCurrentMonthTrans(currTrans))
            }
        }
        // console.log(currentMonthTrans)
        //console.log(pastMonths) 
        
    }
    

    const [newly, setNewly] = useState(false)
    // Runs the functions inside
    useEffect(() => {
        if(isFocused) {
            fetchTransaction();
        }   
            
    }, [isFocused])


    return (
        <ImageBackground source={background} style={{flex:1, justifyContent: 'center'}} blurRadius={(addIncomeVisible || addExpenseVisible) ? 4 : 0}>

{/*******************************************************************/}
{/*    These are the income and expense modals to be displayed      */}
{/*******************************************************************/}

            {/* Add Income Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addIncomeVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
                
            >
                <Pressable style={styles.centeredView} onPress={(event) => event.target == event.currentTarget && setAddIncomeVisible(false)}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>Add Income!</Text>     
                        <CustomInput 
                            name = "amount"
                            placeholder='0.00'
                            control={control}
                            rules={{
                                required: 'An Amount is required', 
                            }}
                            extraStyle={styles.iconInput} 
                            icon={'logo-usd'}     
                            color={'rgb(0,240,0)'}    
                            type='number-pad'                          
                        />

                        <Text style={styles.modalText}>Add Description!</Text>
                        <CustomInput 
                            name = "description"
                            placeholder='Enter desciption...'
                            control={control}
                            rules={{
                               required: 'A description is required',
                            }}
                            extraStyle={styles.description}
                        />
                        {
                            loading ? (
                                <Loading color={Colors.secondary}/>
                            ) : (
                                <Pressable
                                    style= {( {pressed} ) =>[styles.button, pressed ? {opacity: .8}:{opacity: 1}]}
                                    onPress={handleSubmit(handleAddIncome)}
                                >
                                    <Text style={styles.textStyle}>Submit</Text>
                                </Pressable>
                            )
                        }
                        
                    </View>
                </Pressable>
            </Modal>


            {/* Add Expense Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addExpenseVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!addExpenseVisible);
                }}
            >
                <Pressable style={styles.centeredView} onPress={(event) => event.target == event.currentTarget && setAddExpenseVisible(false)}>
                
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Add Expense!</Text>
                        <CustomInput 
                            name = "amount"
                            placeholder='0.00'
                            control={control}
                            rules={{
                                required: 'An Amount is required', 
                            }}
                            extraStyle={styles.iconInput}
                            icon={'logo-usd'}
                            color={'rgb(240,0,0)'}
                            type='number-pad'
                        />

                        <Text style={styles.modalText}>Budget?</Text>
                        <DropDownPicker 
                            value={budget}
                            //stickyHeader={true}
                            items={items}
                            setItems={setItems}
                            setValue={setBudget}
                            placeholder='Select Budget'
                            containerStyle={{height: 60}}
                            style={{backgroundColor: '#fff'}}
                            setOpen={setOpen}
                            open={open}  
                                 
                            // {
                            //     ...addExpenseVisible==false ? (setValue(null)):(null)
                            // }                     
                        />

                        <Text style={styles.modalText}>Add Description!</Text>
                        <CustomInput 
                            name = "description"
                            placeholder='Enter desciption...'
                            control={control}
                            rules={{
                                required: 'An Amount is required', 
                            }}
                            extraStyle={styles.description}
                        />
                        {
                            loading ? (
                                <Loading color={Colors.secondary}/>
                            ) : (
                                <Pressable
                                    style= {( {pressed} ) =>[styles.button, pressed ? {opacity: .8}:{opacity: 1}]}
                                    onPress={handleSubmit(handleAddExpense)}
                                >
                                    <Text style={styles.textStyle}>Submitt</Text>
                                </Pressable>
                            )
                        }
                    </View>
                </Pressable>
            </Modal>

{/*******************************************************************/}
{/*                 This is the Regular Monthly UI                  */}
{/*******************************************************************/}
            
            <View style = {{flex: 1, alignItems: 'center'}} >
                <Banner title={'Monthly'} onRefresh={onRefresh}/>

               
                <InfoBox otherStyles={{justifyContent: 'space-around'}}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{color: Colors.black, fontSize: 17}}>Income:</Text>
                        <View style={styles.totalView}>
                            <Text style={{color: 'rgb(0,200,0)', fontSize: 18}}>${monthlyIncome}</Text>
                        </View>
                        <Text></Text>
                    </View>
                    
                    <View style={{alignItems: 'center'}}>
                        <Text style={{color: Colors.black, fontSize: 17}}>Expense:</Text>
                        <View style={styles.totalView}>
                            <Text style={{color: 'rgb(220,0,0)', fontSize: 18}}>${monthlyExpense}</Text>
                        </View>
                        <Text></Text>
                    </View>
                </InfoBox>
                

                    { showMonthly ? 
                    (   
                        <View style={{width: '100%', height: '100%', alignItems: 'center',}} animationType={'slide'}>
                            <ListBox otherStyles={{height: '45%', width: '85%',}}>
                                <FlatList
                                    style={{width: '100%'}}
                                    data={monthly}
                                    ListEmptyComponent={
                                        <View style={{alignItems:'center', justifyContent: 'center', padding: 15}}>
                                            <Text style={{fontSize: 18, fontFamily: 'Judson-Regular', color: 'black', textAlign: 'center', marginBottom: 15}}>No Monthly expenses to generate any Modules</Text>
                                            <Loading/>
                                        </View>  
                                    }
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => {
                                        return (
                                            <View style={{flexDirection: 'row', height: 70, width: '100%', borderBottomColor: '#000', borderBottomWidth: .5, padding: 15}}>
                                                <View style={{backgroundColor: '#fff', height: 40, width: 40, borderRadius: 40/2, marginRight: 15, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Ionicons name={item.name == "Income"  ? ('card') : (
                                                        budgetIcons.find((icons) => icons.name == item.name).icon
                                                    )} size={25}/>
                                                </View>
                                                <View style={{flexDirection: 'column', justifyContent: 'space-around', width: '60%' }}>
                                                    <Text style={{fontFamily: 'Judson-Bold', fontSize: 21, color: '#000'}}>{item.name}</Text>
                                                    <Text style={{fontFamily: 'Judson-regular', fontSize: 12, color: '#555'}}>{item.description}</Text>
                                                </View>
                                                <View style={{alignItems: 'center', justifyContent: 'center', width: '25%'}}>
                                                    <Text style={{fontFamily: 'Judson-Bold', fontSize: 21, color: '#000'}}>${item.amount}</Text>
                                                </View>
                                            </View>
                                        )
                                    }}
                                />
                            </ListBox>

                            <LinearGradient colors={[Colors.lightPrime, Colors.secondary]} style={styles.bottomButton}>
                                <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={onCancelShow}>
                                    <Ionicons name='list' size={35}/>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                            
                        
                        
                    ) : 
                    (
                        <View style = {{flexDirection: 'column', marginTop: 45, height: '50%'}}>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity
                                    style={styles.add}
                                    onPress={addIncomePressed}
                                >
                                    <Text style={styles.touchableOpacityText}>Add Income</Text>
                                    <Text style={{color: 'rgb(0,200,0)', fontSize: 25, fontWeight: 'bold'}}>+ $$</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.add}
                                    onPress={addExpensePressed}
                                > 
                                    <Text style={styles.touchableOpacityText}>Add Expense</Text>
                                    <Text style={{color: 'rgb(220,0,0)', fontSize: 25, fontWeight: 'bold'}}>- $$</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity 
                                    style={styles.view}
                                    onPress={onShow}
                                >
                                    <Text style={[styles.touchableOpacityText, {marginBottom: 10}]}>View Monthly Transactions</Text>
                                    <Ionicons name='list' size={30} color='black'/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                




                <View style = {[styles.profit, {top: 120}]}>
                    <Text style = {styles.profit_text}>Monthly Income:</Text>
                    <Text style = {styles.profit_text}>${monthlyIncome}</Text>
                </View>
                <View style = {[styles.profit, {top: 340}]}>
                    <Text style = {styles.profit_text}>Total Profit:</Text>
                    <Text style = {styles.profit_text}>${monthlyProfit}</Text>
                </View>
        
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    totalView: {
        backgroundColor: '#fff', 
        width: 110, 
        height: 50, 
        borderRadius: 15, 
        opacity: .9, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    add: {
        height: '90%',
        width: '45%',
        backgroundColor: Colors.lightSecondary,
        opacity: .6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    view: {
        height: '75%',
        width: '100%',
        backgroundColor: Colors.lightSecondary,
        opacity: .6,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    profit: {
        height: '7%',
        width: '80%',
        backgroundColor: Colors.lightSecondary,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 30,

        flexDirection: 'row',
        paddingRight: 15,
        
        position: 'absolute',
    },
    profit_text: {
        marginLeft: 15,
        fontFamily: 'Judson-Regular',
        color: Colors.primary,
        fontSize: 24,
    },
    bottomButton: {
        backgroundColor: 'white',
        height: 80,
        width: 80,
        borderRadius: 80/2,
        alignItems: 'center', 
        justifyContent: 'center',


        position: 'absolute',
        top: 350,
        right: -10
    },

    // Modal
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        
    },
    modalView: {
        height: 'auto',
        width: '85%',
        backgroundColor: Colors.primary,
        
        margin: 20,
        padding: 25,
        
        borderRadius: 20,
        
        alignItems: 'left',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        
    },
    description: {
        height: 70,
        width: '108%',
        backgroundColor: 'white',

        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 15,

        fontWeight: 'bold',
        fontSize: 16,

        
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
        color: Colors.black,
        fontSize: 20,
    },
    icon: {
        width: 40, 
        height: 40, 
        backgroundColor: 'white', 
        
        borderBottomLeftRadius: 10, 
        borderTopLeftRadius: 10, 
        borderWidth: 1,
        
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    iconInput: {
        width: '92%', 
        height: 40, 
        backgroundColor: 'white', 
  
        borderLeftColor: '#000', 
        borderLeftWidth: .5,
        borderBottomRightRadius: 10, 
        borderTopRightRadius: 10, 
        borderWidth: 1,
  
        marginBottom: 15, 
        paddingLeft: 10, 
  
        fontWeight: 'bold', 
        fontSize: 16,
    },


    touchableOpacityText: {
        color: Colors.black, 
        fontSize: 20, 
        fontFamily: 'jbold'
    }
})


