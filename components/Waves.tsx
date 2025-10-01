import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type WavesProps = {
  height?: number;
};

export default function Waves({ height = 220 }: WavesProps) {
  const primary = Colors.light.primary;
  const layer1 = '#2563eb';
  const layer2 = '#4f82f0';
  const layer3 = '#7ca3f2';
  const layer4 = '#a9c4f4';

  return (
    <View style={[styles.container, { height }]}> 
      <Svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <Path fill={layer4} d="M0,256L60,229.3C120,203,240,149,360,160C480,171,600,245,720,245.3C840,245,960,171,1080,144C1200,117,1320,139,1380,149.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"/>
        <Path fill={layer3} d="M0,224L48,224C96,224,192,224,288,229.3C384,235,480,245,576,245.3C672,245,768,235,864,224C960,213,1056,203,1152,202.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
        <Path fill={layer2} d="M0,288L80,266.7C160,245,320,203,480,170.7C640,139,800,117,960,117.3C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"/>
        <Path fill={layer1} d="M0,288L48,277.3C96,267,192,245,288,202.7C384,160,480,96,576,96C672,96,768,160,864,197.3C960,235,1056,245,1152,218.7C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});


