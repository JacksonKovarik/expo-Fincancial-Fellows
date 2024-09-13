import React, { useEffect, useRef, useState } from "react";
import { 
    View, 
    Text, 
    ImageBackground, 
    StyleSheet, 
    FlatList, 
    Pressable, 
    LogBox
} from "react-native";
import background from "@/assets/images/Bottom_Background.png"
import { Colors } from "@/constants/Colors";
// import { LineChart } from "react-native-gifted-charts";
import { LineChart } from "react-native-chart-kit";
import Loading from "@/components/Loading";
import InfoBox from '@/components/infoBox';
import ListBox from '@/components/listBox';


import { useIsFocused } from "@react-navigation/native";

// Redux
import { useDispatch, useSelector } from "react-redux";

import Banner from "@/components/Banner";
import { setYearly } from "@/context/slices/user_transactions";
import { LinearGradient } from "expo-linear-gradient";
import { setCurrentMonthTrans, setPastMonths } from "@/context/slices/user_years";

 


export default function Years ({navigation}) {

    LogBox.ignoreAllLogs();

/*************************************************************************************/
//                      Variables/States for the Yearly tab
/*************************************************************************************/

    // Boolean based on if the screen is in focus or not
    const isFocused = useIsFocused();

    const ref = useRef(null)

    // Information needed for the linechart and screen data
    const [max, setMax] = useState(0)
    const [nums, setNums] = useState([])
    const [monthVals, setMonthVals] = useState([])
    const [yearlyIncome, setYearlyIncome] = useState(0)
    const [yearlyProfit, setYearlyProfit] = useState(0)
    const [chartVisible, setChartVisible] = useState(false)
    let completeData = []

    // Lets the app know if the screen was refreshed
    const [refresh, setRefresh] = useState(false);

    // List of the month names
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


    // States via redux information
    const {yearly, transactions, monthly} = useSelector(state => state.persistTransaction)
    const {currentMonthTrans, pastMonths} = useSelector(state => state.persistedReducer)
    const dispatch = useDispatch()


/*************************************************************************************/
//                      Functions for the Yearly tab
/*************************************************************************************/

    const fetchPastMonths = () => {
        if (monthly.length > 0) {
            let past = []
            let currTrans = []

            let inc = 0
            let exp = 0
            let total = 0 

                for (i in monthly){                
                    total += monthly[i].amount
                    if (monthly[i].name == 'Income') {
                        inc += monthly[i].amount
                    }else {
                        exp += monthly[i].amount
                    }
                } 

                if(currentMonthTrans.length < 1 || monthly[0].month != currentMonthTrans[0].month){
                    // New Month
                    let saved = 0
                    {
                        total > 0 ? 
                        (  saved = (total/inc)*100) : 
                        ( saved = 0 )
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
                    console.log("CURRENT",currentMonthTrans, pastMonths)
                }else if(total != currentMonthTrans[0].amount || inc != currentMonthTrans[0].income || (((total/inc)*100).toFixed(0) != currentMonthTrans[0].saved && inc != 0)) {
                    // New transactions have been made
                    currTrans.push({
                        income: inc,
                        amount: total,
                        saved: inc != 0 ?((total/inc)*100).toFixed(0):(0),
                        month: monthly[0].month,
                    })
                    dispatch(setCurrentMonthTrans(currTrans))
                }
        }        
    }

    // Function for retriving data needed from the 'currentMonthTrans' and 'pastMonths' state variables
    const fetchYearly = () => {
        setChartVisible(false)
        if(transactions.length > 0){
            if(pastMonths.length > 0) {
                let vals = [];
                let amt = [];
                let last = 0;
                let income = 0;
                //console.log(currentMonthTrans)
                let done = false;
                while(!done){
                    
                    amt.push(currentMonthTrans[0].amount)
                    vals.push(months[currentMonthTrans[0].month])
                    income += currentMonthTrans[0].income
                    pastMonths.forEach((result) => {
                        vals.unshift(months[result.month])
                        amt.unshift(result.amount)
                        income += result.income
                        {vals.length > 6 && (done=true)}
                        last = result.month
                    })
                    setYearlyIncome(income)
                    setMonthVals(vals);
                    setNums(amt);
                    done=true
                }
                
                let newMonth = last - 1;
                console.log(newMonth, months[newMonth])
                while(newMonth > -1) {
                    
                    vals.unshift(months[newMonth]);
                    amt.unshift(0);
                    newMonth -= 1;
                }


                
            }else if(currentMonthTrans.length > 0) {
                let vals = [];
                let amt = [];
                let currMonth = currentMonthTrans[0].month;
                let currAmt = currentMonthTrans[0].amount;
                console.log(currMonth)
                vals.push(months[currMonth]);
                amt.push(currAmt);

                let newMonth = currMonth -1;
                while(newMonth > -1) {
                    vals.unshift(months[newMonth]);
                    amt.unshift(0);
                    newMonth -= 1;
                }
                console.log(amt)
                setYearlyIncome(currentMonthTrans[0].income)
                setMonthVals(vals);
                setNums(amt);
                
            }  
            
            let len = nums.length;
            let fullData = []
            let i=0
            while(i<len){
                fullData.push({label: monthVals[i], value: nums[i] })
                i += 1
            }
            if(fullData.length != 0) {
                dispatch(setYearly(fullData));
                setChartVisible(true)
            }else {
                dispatch(setYearly([]))
            }

            let newNums = 0
            for(i in nums) {
                newNums += nums[i]
            }
            setYearlyProfit(newNums)
            // console.log(yearlyProfit)
        }else {
            dispatch(setYearly([]));
        }
        console.log(yearly)
    }

    // Refreshes the screens to fetch new stats
    const onRefresh = () => {
        setRefresh(true);
        fetchPastMonths();
        fetchYearly();
        setTimeout ( () => {
            setRefresh(false)
        }, 500)
    }

    // Calls 'fetchData()' when screen is focused
    useEffect(() => {
        if (isFocused) {
            fetchPastMonths();
            fetchYearly();
        }
    }, [isFocused])
      

    return (    
    <ImageBackground source={background} style={{flex:1, justifyContent: 'center'}}>
        <View style = {{flex: 1, alignItems: 'center'}}>
            <Banner title={'Yearly'} onRefresh={onRefresh}/>

            {/* Where the line chart is displayed */}
            <InfoBox>
                { chartVisible ? ( 
                    <LineChart
                        data={{
                            labels: monthVals,
                            datasets: [
                                {
                                    data: nums
                                }
                            ]
                        }}
                        width={300} 
                        height={120}
                        yAxisLabel="$"
                        yAxisInterval={1} // optional, defaults to 1
                        withHorizontalLabels= {true}
                        withVerticalLabels={true}
                        withInnerLines={false}
                        verticalLabelRotation={-40}
                        
                        chartConfig={{
                            backgroundGradientFrom: Colors.primary,
                            backgroundGradientTo: Colors.lightPrime,
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            
                            
                            
                            color: (opacity = 1) => `rgba(0, 180, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForVerticalLabels: {
                                fontSize: 12,
                            },
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "3",
                                strokeWidth: "2",
                            },
                        
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                            paddingBottom: 15
                        }}
                    
                    />
                ) : (
                    <View style={{alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 21, fontFamily: 'jreg', color: 'black', textAlign: 'center'}}>Not enough data from the year to produce a Graph</Text>
                    </View>
                )}
            </InfoBox>

            <View style={{marginTop: 40, width: '80%'}}>
                <Text style = {{textAlign: 'left', color: 'black'}}>Current Month</Text>
            </View>
            <LinearGradient colors={[Colors.primary, Colors.lightPrime]} style={{width: '85%', borderRadius: 15, marginTop: 10}}>
                {currentMonthTrans.length > 0 ? (
                    <View style={{flexDirection: 'row', height: 70, width: '100%', padding: 15}}>
                        <View style={{backgroundColor: currentMonthTrans[0].amount < 0 ? ('red') : ('green'), height: 40, width: 40, borderRadius: 40/2, marginRight: 15, alignItems: 'center', justifyContent: 'center'}}/>                            
                        <View style={{flexDirection: 'column', justifyContent: 'space-around', width: '60%' }}>
                            <Text style={{fontFamily: 'jbold', fontSize: 21, color: '#000'}}>{months[currentMonthTrans[0].month]}</Text>
                            <Text style={{fontFamily: 'jreg', fontSize: 12, color: '#555'}}>{currentMonthTrans[0].saved}% Saved</Text> 
                        </View>
                            <View style={{alignItems: 'center', justifyContent: 'center', width: '25%'}}>
                            <Text style={{fontFamily: 'jbold', fontSize: 21, color: '#000'}}>${currentMonthTrans[0].amount}</Text>
                        </View>
                    </View> 
                ) : (
                    <View style={{alignItems:'center', justifyContent: 'center', height: 70, padding: 15}}>
                        <Text style={{fontSize: 18, fontFamily: 'jreg', color: 'black', textAlign: 'center'}}>Not enough data</Text>
                    </View>
                )}
                
            </LinearGradient>

            <View style={{marginTop: 15, width: '80%'}}>
                <Text style = {{textAlign: 'left', color: 'black'}}>Past Months</Text>
            </View>

            <ListBox otherStyles={{marginTop: 10}}>
                <FlatList 
                    style = {{width: '100%'}} 
                    data={pastMonths}
                    ListEmptyComponent={
                        <View style={{alignItems:'center', justifyContent: 'center', padding: 15}}>
                            <Text style={{fontSize: 18, fontFamily: 'jreg', color: 'black', textAlign: 'center', marginBottom: 15}}>Not Enough Data</Text>
                            <Loading/>
                        </View>  
                    }
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                        return (
                            <View style={{flexDirection: 'row', height: 70, width: '100%', borderBottomColor: '#000', borderBottomWidth: .5, padding: 15}}>
                                <View style={{backgroundColor: item.amount < 0 ? ('red') : ('green'), height: 40, width: 40, borderRadius: 40/2, marginRight: 15, alignItems: 'center', justifyContent: 'center'}}/>
                                <View style={{flexDirection: 'column', justifyContent: 'space-around', width: '60%' }}>
                                    <Text style={{fontFamily: 'jbold', fontSize: 21, color: '#000'}}>{months[item.month]}</Text>
                                    <Text style={{fontFamily: 'jreg', fontSize: 12, color: '#555'}}>{item.saved}% Saved</Text>
                                </View>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '25%'}}>
                                    <Text style={{fontFamily: 'jbold', fontSize: 21, color: '#000'}}>${item.amount}</Text>
                                </View>
                            </View> 
                        )
                    }}  
                /> 
            </ListBox>
                
            <View style = {[styles.profit, {top: 110}]}>
                <Text style = {styles.income_text}>Yearly Income:</Text>
                <Text style = {styles.income_text}>${yearlyIncome}</Text>
            </View>
            <View style = {[styles.profit, {top: 342}]}>
                <Text style = {styles.income_text}>Yearly Profit:</Text>
                <Text style = {styles.income_text}>${yearlyProfit}</Text>
            </View>

        </View>
    </ImageBackground>
)
}


// All styles for the Years page
const styles = StyleSheet.create({
    list: {
        height: '45%',
        width: '85%',
        borderRadius: 20,
        marginTop: 45,
        // flexDirection: 'column',
    },
    add: {
        height: '90%',
        width: '45%',
        backgroundColor: Colors.lightSecondary,
        opacity: .6,
        borderRadius: 20,
    },
    view: {
        height: '75%',
        width: '100%',
        backgroundColor: Colors.lightSecondary,
        opacity: .6,
        borderRadius: 20,
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
    income_text: {
        marginLeft: 15,
        fontFamily: 'jreg',
        color: Colors.primary,
        fontSize: 24,
    },
    circle: {
        height: 100,
        width: 100,
        borderRadius: 100/2,
        backgroundColor: Colors.lightPrime,
        position: 'absolute',
        right: 202,
        top: 45,

        padding: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    
})