'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { GaugeContainer, GaugeContainerProps } from './GaugeContainer';
import { GaugeValueArc } from './GaugeValueArc';
import { GaugeReferenceArc } from './GaugeReferenceArc';
import { GaugeClasses, getGaugeUtilityClass } from './gaugeClasses';
import { GaugeValueText, GaugeValueTextProps } from './GaugeValueText';

export interface GaugeProps extends GaugeContainerProps, Pick<GaugeValueTextProps, 'text'> {
  classes?: Partial<GaugeClasses>;
  children?: React.ReactNode;
}

const useUtilityClasses = (props: GaugeProps) => {
  const { classes } = props;

  const slots = {
    root: ['root'],
    valueArc: ['valueArc'],
    referenceArc: ['referenceArc'],
    valueText: ['valueText'],
  };

  return composeClasses(slots, getGaugeUtilityClass, classes);
};

const Gauge = React.forwardRef(function Gauge(props: GaugeProps, ref: React.Ref<SVGSVGElement>) {
  const { text, children, classes: propsClasses, className, skipAnimation, ...other } = props;
  const classes = useUtilityClasses(props);

  return (
    <GaugeContainer {...other} className={clsx(classes.root, className)} ref={ref}>
      <GaugeReferenceArc className={classes.referenceArc} />
      <GaugeValueArc className={classes.valueArc} skipAnimation={skipAnimation} />
      <GaugeValueText className={classes.valueText} text={text} />
      {children}
    </GaugeContainer>
  );
});

Gauge.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The radius applied to arc corners (similar to border radius).
   * Set it to '50%' to get rounded arc.
   * @default 0
   */
  cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The x coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the width the drawing area.
   */
  cx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The y coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the height the drawing area.
   */
  cy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  desc: PropTypes.string,
  /**
   * The end angle (deg).
   * @default 360
   */
  endAngle: PropTypes.number,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * The radius between circle center and the beginning of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '80%'
   */
  innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  margin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * The radius between circle center and the end of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '100%'
   */
  outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.bool,
  /**
   * The start angle (deg).
   * @default 0
   */
  startAngle: PropTypes.number,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  text: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  title: PropTypes.string,
  /**
   * The value of the gauge.
   * Set to `null` to not display a value.
   */
  value: PropTypes.number,
  /**
   * The maximal value of the gauge.
   * @default 100
   */
  valueMax: PropTypes.number,
  /**
   * The minimal value of the gauge.
   * @default 0
   */
  valueMin: PropTypes.number,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { Gauge };
