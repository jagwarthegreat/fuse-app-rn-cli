import React, { useState, useRef } from "react";
import { View, Text, Image, useWindowDimensions, FlatList, TouchableOpacity } from "react-native";
import styles from './styles';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {setOnBoarding} from '../../../redux/reducer/OnBoarding';
import {useDispatch} from 'react-redux';

const slides = [
	{
		id: 1,
		title: 'Find Stations',
		description: 'Search for the nearest EV charging stations and power up your journey.',
		image: '',
	},
	{
		id: 2,
		title: 'Charge Your Vehicle',
		description: 'Charge up and hit the road with ease and confidence.',
		image: '',
	},
	{
		id: 3,
		title: 'Pay and Go',
		description: 'Charge, Pay, and Go. Experience the convenience of charging and paying with just a single app.',
		image: '',
	},
]

export default function OnboardingScreen(){
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
	const ref = useRef(null);
    const dispatch = useDispatch();

	const navigation = useNavigation();
	const {width, height} = useWindowDimensions();

	const Slide = ({item}) => {
		return(
			<View style={[styles.container, {width}]}>
				<View style={styles.imageParentContainer}>
					<Image 
						source={item.image}
						style={styles.image}
					/>
					<View style={styles.childContainer}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.description}>{item.description}</Text>
					</View>
				</View>
			</View>
		)
	};

	const updateCurrentSlideIndex = e => {
		const contentOffsetX =  e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / width);
		setCurrentSlideIndex(currentIndex);
	};

	const goNextSlide = () => {
		const nextSlideIndex = currentSlideIndex + 1;
		if (nextSlideIndex != slides.length) {
			const offset = nextSlideIndex * width;
			ref?.current?.scrollToOffset({ offset });
			setCurrentSlideIndex(nextSlideIndex);
		}
	};

	const goPrevSlide = () => {
		const prevSlideIndex = currentSlideIndex - 1;
		if (prevSlideIndex >= 0) {
		  	const offset = prevSlideIndex * width;
			ref?.current?.scrollToOffset({ offset });
			setCurrentSlideIndex(prevSlideIndex);
		}
	};

	const handleDone = () => {
		dispatch(setOnBoarding(false))
		navigation.replace('LoginScreen') 
	};

	const Footer = () => {
		return(
			<>
			{currentSlideIndex > 0 && (
				<View style={styles.prevContainer}>
					<TouchableOpacity onPress={goPrevSlide}> 
						<AntDesignIcon name='arrowleft' color={'#FFF'} style={styles.backBtn}/>
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.footerContainer}>
				<View style={styles.dotsContainer}>
					{slides.map((_, index) => 
						<View 
							style={[styles.indicator, currentSlideIndex == index && {
								backgroundColor: '#FF9B25',
								width: 8
							}]}
							key={index}
						/>
					)}
				</View>
				<View style={{paddingBottom: 20}}>
					{currentSlideIndex == slides.length -1 ?(
					<TouchableOpacity style={{width: '60%', justifyContent: 'center', alignSelf: 'center'}} onPress={handleDone}>
						<View style={styles.doneContainer}>
							<Text style={styles.doneText}>Get Started</Text>
						</View> 
					</TouchableOpacity>
					) : (
					<TouchableOpacity style={styles.nextContainer} onPress={goNextSlide}>
						<View>
							<Text style={styles.labelText}>Next</Text>
						</View>
						<View style={styles.iconContainer}>
							<AntDesignIcon name='arrowright' style={styles.rightIcon}/>
						</View>
					</TouchableOpacity>
					)}
				</View>
			</View>
			</>
		)
	}
	
	return (
		<View style={styles.container}>
			<FlatList 
				ref={ref}
				onMomentumScrollEnd={updateCurrentSlideIndex}
				data={slides}
				contentContainerStyle={{height: height * 0.80}}
				pagingEnabled
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={32}
				renderItem={({item}) => <Slide item={item}/>}
			/>
			<Footer />
		</View>
	);
}