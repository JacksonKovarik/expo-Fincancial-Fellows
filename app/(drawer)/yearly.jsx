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
import { LineChart } from "react-native-gifted-charts";
import Loading from "@/components/Loading";
import { useIsFocused } from "@react-navigation/native";

// Redux
// import { useDispatch, useSelector } from "react-redux";

import Banner from "@/components/Banner";

 


export default function Years ({navigation}) {

    LogBox.ignoreAllLogs();

/*************************************************************************************/
//                      Variables/States for the Yearly tab
/*************************************************************************************/

    // Boolean based on if the screen is in focus or not
    const isFocused = useIsFocused();

    const ref = useRef(null)

    // Information needed for the linechart and screen data
    const [nums, setNums] = useState([])
    const [monthVals, setMonthVals] = useState([])
    const [yearlyIncome, setYearlyIncome] = useState(0)
    const [yearlyProfit, setYearlyProfit] = useState(0)
    const [chartVisible, setChartVisible] = useState(false)

    // Lets the app know if the screen was refreshed
    const [refresh, setRefresh] = useState(false);

    // List of the month names
    const months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];

    // States via redux containing the current month and past month information
    // const {currentMonthTrans, pastMonths} = useSelector(state => state.persistedReducer)
    // const dispatch = useDispatch()
    
    const currentMonthTrans = [{
        month: 'August',
        saved: '40%',
        amount: 4000
    }]

/*************************************************************************************/
//                      Functions for the Yearly tab
/*************************************************************************************/

    // Function for retriving data needed from the 'currentMonthTrans' and 'pastMonths' state variables
    // const fetchData = () => {
    //     //console.log(pastMonths.length)
    //     if(pastMonths.length > 0) {
    //         let vals = [];
    //         let amt = [];
    //         //console.log(currentMonthTrans)
    //         let done = false
    //         while(!done){
    //             amt.push(currentMonthTrans[0].amount)
    //             vals.push(months[currentMonthTrans[0].month])
    //             pastMonths.forEach((result) => {
    //                 vals.push(months[result.month])
    //                 amt.push(result.amount)
    //                 {vals.length > 6 && (done=true)}
    //             })
                
               
    //             setMonthVals(vals.reverse());
    //             setNums(amt.reverse());
    //             done=true
    //         }
            
    //         let currMonth = currentMonthTrans[0].month;
    //         let newMonth = currMonth -1;
    //         while(newMonth > -1) {
    //             vals.push(months[newMonth]);
    //             amt.push(0);
    //             newMonth -= 1;
    //         }
            
    //     }else if(currentMonthTrans.length > 0) {
    //         let vals = [];
    //         let amt = [];
    //         let currMonth = currentMonthTrans[0].month;
    //         let currAmt = currentMonthTrans[0].amount;
            
    //         vals.push(months[currMonth]);
    //         amt.push(currAmt);

    //         let newMonth = currMonth -1;
    //         while(newMonth > -1) {
    //             vals.push(months[newMonth]);
    //             amt.push(0);
    //             newMonth -= 1;
    //         }
    //         //console.log(amt)
    //         setMonthVals(vals.reverse());
    //         setNums(amt.reverse());
            
    //     };  

    //     if(currentMonthTrans.length > 0) {
    //         setChartVisible(true)
    //     }else {
    //         setChartVisible(false)
    //     }
    //     //console.log(nums)
    //     let newNums = 0
    //     for(i in nums) {
    //         newNums += nums[i]
    //     }
    //     setYearlyProfit(newNums)
    //     // console.log(yearlyProfit)

    //     let newInc = 0
    //     for (i in currentMonthTrans) {
    //         newInc += currentMonthTrans[i].income
    //     }
    //     setYearlyIncome(newInc)
    //     // console.log(yearlyIncome)
    // }

    // Refreshes the screens to fetch new stats
    const onRefresh = () => {
        setRefresh(true);
        // fetchData();
        setTimeout ( () => {
            setRefresh(false)
        }, 500)
    }

    // Calls 'fetchData()' when screen is focused
    useEffect(() => {
        if (isFocused) {
            // fetchData();
        }
    }, [isFocused])

    // Fill in line chart data
    const latestData = [
        {
          value: 100,
          customDataPoint: dPoint,
        },
        {
          value: 120,
          hideDataPoint: true,
        },
        {
          value: 210,
          customDataPoint: dPoint,
        },
        {
          value: 250,
          hideDataPoint: true,
        },
        {
          value: 320,
          customDataPoint: dPoint,
        },
        {
          value: 310,
          hideDataPoint: true,
        },
        {
          value: 270,
          customDataPoint: dPoint,
        },
        {
          value: 240,
          hideDataPoint: true,
        },
        {
          value: 130,
          customDataPoint: dPoint,
        },
        {
          value: 120,
          hideDataPoint: true,
        },
        {
          value: 100,
          customDataPoint: dPoint,
        },
        {
          value: 210,
          hideDataPoint: true,
        },
        {
          value: 270,
          customDataPoint: dPoint,
        },
        {
          value: 240,
          hideDataPoint: true,
        },
        {
          value: 120,
          hideDataPoint: true,
        },
        {
          value: 100,
          customDataPoint: dPoint,
        },
        {
          value: 210,
          customDataPoint: dPoint,
        },
        {
          value: 20,
          hideDataPoint: true,
        },
        {
          value: 100,
          customDataPoint: dPoint,
        },
      ];

      const dPoint = () => {
        return (
          <View
            style={{
              width: 14,
              height: 14,
              backgroundColor: 'white',
              borderWidth: 3,
              borderRadius: 7,
              borderColor: '#07BAD1',
            }}
          />
        );
      };

    
    return (    
    <ImageBackground source={background} style={{flex:1, justifyContent: 'center'}}>
        <View style = {{flex: 1, alignItems: 'center',}}>
                <Banner title={'Yearly'} />

            {/* Where the line chart is displayed */}
            <View style = {styles.visual}>
                { !chartVisible ? (
                    // <LineChart
                    //     data={{
                    //         labels: monthVals,
                    //         datasets: [
                    //             {
                    //                 data: nums
                    //             }
                    //         ]
                    //     }}
                    //     width={300} 
                    //     height={120}
                    //     yAxisLabel="$"
                    //     yAxisInterval={1} // optional, defaults to 1
                    //     withHorizontalLabels= {true}
                    //     withVerticalLabels={true}
                        
                    //     chartConfig={{
                    //         backgroundColor: COLORS.primary,
                    //         backgroundGradientFrom: COLORS.lightPrime,
                    //         backgroundGradientTo: COLORS.lightPrime,
                    //         //decimalPlaces: 2, // optional, defaults to 2dp
                    //         color: (opacity = 1) => `rgba(0, 180, 0, ${opacity})`,
                    //         labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    //         propsForVerticalLabels: {
                    //             fontSize: 12,
                    //         },
                    //         style: {
                    //             borderRadius: 16,
                    //         },
                    //         propsForDots: {
                    //             r: "4",
                    //             strokeWidth: "2",
                    //         },
                        
                    //     }}
                    //     bezier
                    //     style={{
                    //         marginVertical: 8,
                    //         borderRadius: 16,
                    //         paddingBottom: 15
                    //     }}
                    
                    // />
                    <LineChart
                        width={250}
                        height={125}
                        isAnimated
                        thickness={3}
                        color="#05f000"
                        maxValue={400}
                        noOfSections={3}
                        animateOnDataChange
                        animationDuration={1000}
                        onDataChangeAnimationDuration={300}
                        areaChart
                        yAxisTextStyle={{color: 'black', fontFamily: 'jreg'}}
                        data={latestData}
                        hideDataPoints
                        startFillColor={"#05f000"}
                        // endFillColor={'rgb(84,219,234)'}
                        startOpacity={0.4}
                        endOpacity={0.1}
                        spacing={15}
                        // backgroundColor="#414141"
                        hideRules
                        rulesColor="lightgray"
                        rulesType="solid"
                        initialSpacing={0}
                        yAxisColor="lightgray"
                        xAxisColor="lightgray"
                        scrollRef={ref}
                        />
                ) : (
                    <View style={{alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 21, fontFamily: 'jreg', color: 'black', textAlign: 'center'}}>Not enough data from the year to produce a Graph</Text>
                    </View>
                )}
            </View>

            <View style={{marginTop: 40, width: '80%'}}>
                <Text style = {{textAlign: 'left', color: 'black'}}>Current Month</Text>
            </View>
            <View style={{width: '85%', backgroundColor: Colors.lightPrime, borderRadius: 15, marginTop: 10}}>
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
                
            </View>

            <View style={{marginTop: 15, width: '80%'}}>
                <Text style = {{textAlign: 'left', color: 'black'}}>Past Months</Text>
            </View>

            {/* <FlatList 
                style = {styles.list} 
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
                                <Text style={{fontFamily: 'jreg', fontSize: 12, color: '#555'}}>{item.description}</Text>
                            </View>
                            <View style={{alignItems: 'center', justifyContent: 'center', width: '25%'}}>
                                <Text style={{fontFamily: 'jbold', fontSize: 21, color: '#000'}}>${item.amount}</Text>
                            </View>
                        </View> 
                     )
                }}  
            />  */}
                
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
    banner: {
        flexDirection: 'row',
        height: '16%',
        width: '100%',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    visual: {
        flexDirection: 'row',
        height: '25%',
        width: '85%',
        backgroundColor: Colors.lightPrime,
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    list: {
        height: '55%',
        width: '85%',
        marginTop: 10,
        borderRadius: 20,
        flexDirection: 'column',
        backgroundColor: Colors.lightPrime,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
    },
    newList: {
        backgroundColor: Colors.lightPrime,
        width: '85%',
        height: 90,
        marginBottom: 10,
        padding: 8,
        borderRadius: 15,
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