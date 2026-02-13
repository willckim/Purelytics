/**
 * ScoreRing Component
 * Circular progress indicator showing health score
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme, getScoreColor, getScoreLabel } from '../theme';

const ScoreRing = ({ 
  score, 
  size = 100, 
  strokeWidth = 8,
  showLabel = true,
  animated = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg 
        width={size} 
        height={size} 
        style={styles.svg}
      >
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.colors.surfaceElevated}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Center Content */}
      <View style={styles.centerContent}>
        <Text style={[styles.scoreValue, { color, fontSize: size * 0.3 }]}>
          {score}
        </Text>
        {showLabel && (
          <Text style={[styles.scoreLabel, { fontSize: size * 0.1 }]}>
            {getScoreLabel(score)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontWeight: '700',
    lineHeight: undefined,
  },
  scoreLabel: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default ScoreRing;