export default (function() {
  const windowInnerHeight = window.innerHeight;
  const windowInnerWidth = window.innerWidth;
  const imgHorizontalPadding = 30;
  const imgHeight = Number(windowInnerWidth * 0.45 - imgHorizontalPadding);

  const colors = {
    themeOrange: '#f0af24',
    themeOrangeDark: '#dfa31c',
    themeRed: '#f2615d',
    themeGrey: '#797979',
    themeBackground: '#f2f2f2',
    themeWhite: '#ffffff',
    themeBlack: '#000000',
    themeDefault: '#333333',
    grey100: '#323a45',
    grey70: '#8a959e',
    grey50: '#adb5bb',
    grey30: '#c4cace',
    grey: '#666666',
    lightGrey: '#f0f0f0',
    darkGrey: '#c7c7c7',
    background: '#f7f8f8',
    pink: '#f1706d',
    disabled: '#bbbbbb',
  };

  return {
    verticallyCenterText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    centerByAbsolutePosition: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
    horizontalByAbsolutePosition: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    horizontalByRelativePosition: {
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    hideLongText: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    defaultFont: {
      fontFamily: "nanumgothic, 'Nanum Gothic', sans-serif",
    },
    item: {
      container: {
        display: 'inline-block',
        position: 'relative',
        width: '170px',
        borderTop: `1px solid ${colors.backgroundDark}`,
        borderRight: `1px solid ${colors.backgroundDark}`,
        borderBottom: `2px solid ${colors.backgroundDark}`,
        borderLeft: `1px solid ${colors.backgroundDark}`,
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '20px',
        paddingLeft: '10px',
        boxSizing: 'border-box',
      },
      company: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        letterSpacing: 'nomal',
        textOverflow: 'ellipsis',
        fontSize: '12px',
        fontWeight: 700,
        color: colors.grey,
        height: '30px',
        lineHeight: '30px',
      },
      name: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        letterSpacing: 'nomal',
        fontSize: '13px',
        height: '18px',
        lineHeight: '18px',
      },
      price: {
        letterSpacing: '-1px',
        fontWeight: 'bold',
        fontSize: '15px',
        fontFamily: 'Roboto',
        height: '25px',
        lineHeight: '25px',
      },
      img: {
        container: {
          position: 'relative',
          width: '100%',
          height: `${imgHeight}px`,
          overflow: 'hidden',
        },
        self: {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${imgHeight}px`,
        },
      },
    },
    breakLine: {
      height: '8px',
      backgroundColor: colors.lightGrey,
      borderTop: '1px solid #dddddd',
      borderBottom: '1px solid #dddddd',
      borderLeft: 'none',
      borderRight: 'none',
    },
    componentTitle: {
      container: {
        position: 'relative',
        overflow: 'hidden',
        height: '45px',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: colors.themeBackground,
      },
      tilte: {
        display: 'inline-block',
        marginLeft: '15px',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '13px',
        fontWeight: 'bold',
      },
    },
    colors: colors,
    imgHeight: imgHeight,
  };
})();
