import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    ImageBackground,
    Pressable,
    Modal,
    Alert,
    FlatList,
    LogBox
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/native";

// App utilities from the 'components' or 'constants folder
import { Colors } from "@/constants/Colors"; 
import CustomInput from "@/components/CustomInput";
import Loading from "@/components/Loading";
import background from "@/assets/images/Bottom_Background.png"
import InfoBox from "@/components/infoBox";
import ListBox from "@/components/listBox";

// Firebase Databse
import { addDoc, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { budgetRef, db } from "@/config/firebase";

// React-Hook-Form
import { useForm } from "react-hook-form";

import { Ionicons } from "@expo/vector-icons";
import Banner from "@/components/Banner";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setTargets } from "@/context/slices/user_budgets";



export default function Budget () {

    LogBox.ignoreAllLogs();

    // Variable telling if the screen is focused
    const isFocused = useIsFocused();

    // React-Hook-Form controls
    const {control, handleSubmit} = useForm();


/*************************************************************************************/
//                      Variables/States for the budgets tab
/*************************************************************************************/

    // State letting app know when button is pressed in Modal
    const [loading, setLoading] = useState(false)

    // Global variables that remember their values from the last use using Redux
    const {user} = useSelector(state => state.user)
    const {monthly} = useSelector(state => state.persistTransaction)
    const {targets} = useSelector(state => state.persistTarget)
    const dispatch = useDispatch()


    // Variables for all of the amounts paid towards a budgets 
    const [shopping, setShopping] = useState(0)
    const [food, setFood] = useState(150);
    const [rent, setRent] = useState(0);
    const [bills, setBills] = useState(0);
    const [fuel, setFuel] = useState(0);
    const [other, setOther] = useState(0);

    // Variables for all of the budget targets
    const [targetShop, setTargetShop] = useState(0)
    const [targetFood, setTargetFood] = useState(200);
    const [targetRent, setTargetRent] = useState(0);
    const [targetBills, setTargetBills] = useState(0);
    const [targetFuel, setTargetFuel] = useState(0);
    const [targetOther, setTargetOther] = useState(0);

    // State letting page know when to show modal
    const [modalVisible, setModalVisible] = useState(false)

    // States for the dropdown inside of the 'Add Budget' Modal
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

    // Lets the app know when to refresh
    const [refresh, setRefresh] = useState(false);

    // Array of all the budget information needed for the screen
    const budgets = [
        {
            name: "Shopping",
            amount: Number(shopping),
            target: Number(targetShop),
            percent: `${(shopping/targetShop)*100}%`,
            key: 'shopping',
            icon: "cart",
        },

        {
            name: "Rent",
            amount: Number(rent),
            target: Number(targetRent),
            percent: `${(rent/targetRent)*100}%`,
            key: 'rent',
            icon: "home",
        },
        {
            name: "Food & Drink",
            amount: Number(food),
            target: Number(targetFood),
            percent: `${(food/targetFood)*100}%`,
            key: 'food',
            icon: "logo-apple", 
        },
        {
            name: "Bills",
            amount: Number(bills),
            target: Number(targetBills),
            percent: `${(bills/targetBills)*100}%`,
            key: 'bills',
            icon: "cash",
        },
        {
            name: "Fuel",
            amount: Number(fuel),
            target: Number(targetFuel),
            percent: `${(fuel/targetFuel)*100}%`,
            key: 'fuel',
            icon: "car",
        },
        {
            name: "Other",
            amount: Number(other),
            target: Number(targetOther), 
            percent: `${(other/targetOther)*100}%`,
            key: 'other',
            icon: "gift",
        },  
    ]


/*************************************************************************************/
//                      Functions for the budgets tab
/*************************************************************************************/

    // Handles whether or not the 'Add Budget' modal is visible
    const handleAddBudget = () => {
        setModalVisible(true)
    }

    // Handles if a budget transaction needs to be deleted from the database
    const removeFromFirestore = async (val) => {
        const docRef = (doc(db, 'budgets', val.id));
        console.log(val.id)
        try {
          await deleteDoc(docRef)          
        } catch(ex) {
          console.log(ex); 
        }
    }

    // Handles when a budget transaction is added to the database
    const handleAdd = async(target) => {
        try{
            let doc = await addDoc( budgetRef, {
                name: budget,
                target: Number(target),
                userID: user.uid
            });
            setLoading(false);
            if(doc && doc.id){
                setModalVisible(false)
            }
        }catch(err) {
            console.log(err)
            Alert.alert("Error:", "Something went wrong")
            setModalVisible(false)
            setLoading(false);

        }
    }

    const handlePress = async (data) => {
        setLoading(true);
        let exists = false;
        let target = data.amount
        let previous = targets.find(item => item.name == budget)
        if (previous == null) {
            console.log(true)
            handleAdd(target)
        }else {
            console.log(false)
            Alert.alert("Error", "Already have this budget, would you like to update?", [
                {
                  text: 'No',
                  onPress: () => { exists = true; setModalVisible(false)},
                  style: 'cancel',
                },
                {
                    text: 'OK', 
                    onPress: () => { exists = true, removeFromFirestore(previous); handleAdd(target);}  
                },
            ]);
        }

        setLoading(false);
    }


    // Retrieves the budget data from the Firebase databse
    const fetchBudgets = async () => {

        const q = query(budgetRef, where("userID", "==", user.uid), orderBy('name', 'desc'));
        const querySnapshot = await getDocs(q);
        let data = []
        querySnapshot.forEach(doc => {
            data.push({...doc.data(), id: doc.id, })
        });
        dispatch(setTargets(data))

        
        if (targets.length > 0){
            for(i in targets) {
                Name = targets[i].name;
                Amount = targets[i].target;
    
                if('Shopping' == Name){
                    setTargetShop(Amount);
                }else if('Fuel' == Name){
                    setTargetFuel(Amount);
                }else if('Rent' == Name){
                    setTargetRent(Amount);
                }else if('Bills' == Name){
                    setTargetBills(Amount);
                }else if('Food & Drink' == Name){
                    setTargetFood(Amount);
                }else if('Other' == Name){
                    setTargetOther(Amount);
                };
            }
        }else {
            setTargetShop(0);  
            setTargetFuel(0);
            setTargetRent(0);
            setTargetBills(0);
            setTargetFood(0);
            setTargetOther(0);
        }
        
        setShopping(0);
        setFuel(0);
        setRent(0);
        setBills(0);
        setFood(0);
        setOther(0);
        let shop = 0
        let gas = 0
        let bill = 0
        let ren = 0
        let foo = 0
        let oth = 0

        for(i in monthly) {
            Name = monthly[i].name;
            Amount = monthly[i].amount;

            if('Shopping' == Name){
                shop -= Amount;
                setShopping(shop);
            }else if('Fuel' == Name){
                gas -= Amount;
                setFuel(gas);
            }else if('Rent' == Name){
                ren -= Amount;
                setRent(ren);
            }else if('Bills' == Name){
                bill -= Amount;
                setBills(bill);
            }else if('Food & Drink' == Name){
                foo -= Amount;
                setFood(foo);
            }else if(('Other' || null) == Name){
                oth -= Amount;
                monthly[i].name = 'Other';
                setOther(oth);
            };
            
        }
    };

    // Refreshes the screens to fetch new stats
    const onRefresh = () => {
        setRefresh(true);
        fetchBudgets();
        setTimeout ( () => {
            setRefresh(false)
        }, 500)
    }


    // Calls fetchBudget() when the screen comes into focus
    useEffect (() => {
        if (isFocused) {
            fetchBudgets();
        }
        
    }, [isFocused])


    // Component for displaying the budgets amount left
    function Legend({name, amount, target}) {
        const [left, setLeft] = useState(target - amount);
        const [val, setVal] = useState('left')
        if(left < 0) {
            setLeft(-left);
            setVal('over');
        }
        return (    
            <View style={{flexDirection: 'row', alignItems: 'left', width: '50%', justifyContent: 'center', marginTop: 20}}>
                <Text style={{fontSize: 17, color: Colors.black, fontFamily: 'jbold'}}>{name}: </Text><Text style={[{fontSize: 15, fontFamily: 'jreg'}, val == 'over' ? ({color: 'red',}) : ({color: 'rgb(0,180,0)',})]}>${left} {val}</Text>
            </View>
        )
    }

    return (
        <ImageBackground source={background} style={{flex:1, justifyContent: 'center'}}>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
                
            >
                <Pressable style={styles.centeredView} onPress={(event) => event.target == event.currentTarget && setModalVisible(false)}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>Choose a Category!</Text>
                        <DropDownPicker 
                            value={budget}
                            items={items}
                            setItems={setItems}
                            setValue={setBudget}
                            placeholder='Select Budget'
                            containerStyle={{height: 60}}
                            style={{backgroundColor: '#fff'}}
                            setOpen={setOpen}
                            open={open}  
                                
                        />     

                        <Text style={styles.modalText}>Budget Amount?</Text>
                        <CustomInput 
                            name = "amount"
                            placeholder='0.00'
                            control={control}
                            rules={{
                                required: 'An Amount is required', 
                            }}
                            extraStyle={styles.iconInput} 
                            icon={"logo-usd"}     
                            color={'rgb(220,0,0)'}                              
                        />

                        
                        {
                            loading ? (
                                <Loading color={Colors.secondary}/>
                            ) : (
                                <Pressable
                                    style= {( {pressed} ) =>[styles.button, pressed ? {opacity: .8}:{opacity: 1}]}
                                    onPress={handleSubmit(handlePress)}
                                >
                                    <Text style={styles.textStyle}>Submit</Text>
                                </Pressable>
                            )
                        }
                        
                    </View>
                </Pressable>
            </Modal>

            <View style = {{flex: 1, alignItems: 'center'}} >
                <Banner title={"Budgets"} onRefresh={onRefresh} />
            
            
                <InfoBox otherStyles={{height: 'auto', justifyContent: 'space-around', flexWrap: 'wrap', paddingTop: 15}}>
                        {budgets.map(({name, amount, target}) => {
                            return <Legend name = {name} amount = {amount} target = {target} />
                        })}                    
                </InfoBox>

                
                <Pressable 
                    style={{ height: 60, width: '70%', backgroundColor: Colors.lightSecondary, alignItems: 'center', justifyContent: 'space-between', borderRadius: 30, margin: 20, justifyContent: 'center'}}
                    onPress={handleAddBudget}
                >
                    <Text style={{fontSize: 17, color: Colors.black, fontFamily: 'jbold'}}>Add/Edit Budget</Text>
                </Pressable>
                
                <ListBox otherStyles={{marginTop: 0}}>
                    <FlatList 
                        style = {{width: '100%'}} 
                        data={budgets}
                        ListEmptyComponent={<Loading/>}
                        keyExtractor={item => item.id}
                        setWeeklyIncome={({item}) => { weeklyIncome + item.amount}}
                        renderItem={({item}) => {
                            return (
                                <View style={{flexDirection: 'row', height: 70, width: '100%', borderBottomColor: '#000', borderBottomWidth: .5, padding: 15}}>
                                    <View style={{backgroundColor: 'white', height: 40, width: 40, borderRadius: 40/2, marginRight: 15, alignItems: 'center', justifyContent: 'center'}}>
                                                {/* <FontAwesomeIcon icon = {item.icon} size={25}/>  */}
                                        <Ionicons name={item.icon} size={25} />
                                    </View>
                                    <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>

                                            <View style={{flexDirection: 'column', justifyContent: 'space-around', width: 'auto' }}>
                                                <Text style={{fontFamily: 'Judson-Bold', fontSize: 21, color: '#000'}}>{item.name}</Text>
                                                <Text/>
                                            </View>

                                            <View style={{alignItems: 'center', justifyContent: 'center', width: 'auto'}}>
                                                <Text style={{fontFamily: 'Judson-Bold', fontSize: 16, color: '#888'}}>${item.amount} of ${item.target}</Text>
                                            </View>

                                            
                                        </View>

                                        <View style={styles.bar}>
                                            <View style={[{flex: 1, backgroundColor: Colors.lightSecondary }, item.amount >= item.target ? ({width: '100%'}) : ({width: item.percent})]}/>
                                        </View>
                                    </View> 
                                </View>
                            )
                        }}
                    />
                </ListBox>


                <View style = {[styles.profit, {top: 110}]}>
                    <Text style = {styles.profit_text}>Monthly Budgets</Text>
                </View>
                
            </View>

        </ImageBackground>
    )
}


// All styles for the Budget page
const styles = StyleSheet.create({
    profit: {
        height: '7%',
        width: '80%',
        backgroundColor: Colors.lightSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,

        flexDirection: 'row',
        paddingRight: 15,
        
        position: 'absolute',
    },
    profit_text: {
        marginLeft: 15,
        fontFamily: 'jreg',
        color: Colors.primary,
        fontSize: 24,
    },

    // List
    bar: {
        backgroundColor: 'white',
        height: 6,
        width: '90%'
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

    // Button
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3'
    },

    // Modal Styles
    modalText: {
        marginBottom: 10,
        color: Colors.black,
        fontSize: 20,
    },
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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})