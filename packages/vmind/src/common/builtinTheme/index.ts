import semiDesignLightTheme from '@visactor/vchart-theme/public/semiDesignLight.json';
import semiDesignDarkTheme from '@visactor/vchart-theme/public/semiDesignDark.json';
import arcoDesignLightTheme from '@visactor/vchart-theme/public/arcoDesignLight.json';
import arcoDesignDarkTheme from '@visactor/vchart-theme/public/arcoDesignDark.json';
import veODesignLightTheme from '@visactor/vchart-theme/public/veODesignLight.json';
import veODesignLightAutomobileTheme from '@visactor/vchart-theme/public/veODesignLightAutomobile.json';
import veODesignLightConsumerTheme from '@visactor/vchart-theme/public/veODesignLightConsumer.json';
import veODesignLightCulturalTourismTheme from '@visactor/vchart-theme/public/veODesignLightCulturalTourism.json';
import veODesignLightFinanceTheme from '@visactor/vchart-theme/public/veODesignLightFinance.json';
import veODesignLightGovernmentTheme from '@visactor/vchart-theme/public/veODesignLightGovernment.json';
import veODesignLightMedicalTheme from '@visactor/vchart-theme/public/veODesignLightMedical.json';
import veODesignLightNewEnergyTheme from '@visactor/vchart-theme/public/veODesignLightNewEnergy.json';
import veODesignDarkTheme from '@visactor/vchart-theme/public/veODesignDark.json';
import veODesignDarkAutomobileTheme from '@visactor/vchart-theme/public/veODesignDarkAutomobile.json';
import veODesignDarkConsumerTheme from '@visactor/vchart-theme/public/veODesignDarkConsumer.json';
import veODesignDarkCulturalTourismTheme from '@visactor/vchart-theme/public/veODesignDarkCulturalTourism.json';
import veODesignDarkFinanceTheme from '@visactor/vchart-theme/public/veODesignDarkFinance.json';
import veODesignDarkGovernmentTheme from '@visactor/vchart-theme/public/veODesignDarkGovernment.json';
import veODesignDarkMedicalTheme from '@visactor/vchart-theme/public/veODesignDarkMedical.json';
import veODesignDarkNewEnergyTheme from '@visactor/vchart-theme/public/veODesignDarkNewEnergy.json';

export enum BuiltinThemeType {
  /**
   * Semi-design official theme
   */
  SemiThemeLight = 'semiThemeLight',
  SemiThemeDark = 'semiThemeDark',
  /**
   * Arco-design official theme
   */
  ArcoThemeLight = 'arcoThemeLight',
  ArcoThemeDark = 'arcoThemeDark',
  /**
   * Ve-o-design official theme
   */
  VeOThemeLight = 'veOThemeLight',
  VeOThemeFinanceLight = 'veOThemeFinanceLight',
  VeOThemeGovernmentLight = 'veOThemeGovernmentLight',
  VeOThemeConsumerLight = 'veOThemeConsumerLight',
  VeOThemeAutomobileLight = 'veOThemeAutomobileLight',
  VeOThemeCulturalTourismLight = 'veOThemeCulturalTourismLight',
  VeOThemeMedicalLight = 'veOThemeMedicalLight',
  VeOThemeNewEnergyLight = 'veOThemeNewEnergyLight',
  VeOThemeDark = 'veOThemeDark',
  VeOThemeFinanceDark = 'veOThemeFinanceDark',
  VeOThemeGovernmentDark = 'veOThemeGovernmentDark',
  VeOThemeConsumerDark = 'veOThemeConsumerDark',
  VeOThemeAutomobileDark = 'veOThemeAutomobileDark',
  VeOThemeCulturalTourismDark = 'veOThemeCulturalTourismDark',
  VeOThemeMedicalDark = 'veOThemeMedicalDark',
  VeOThemeNewEnergyDark = 'veOThemeNewEnergyDark'
}

export const builtinThemeMap: { [key: string]: any } = {
  [BuiltinThemeType.SemiThemeLight]: semiDesignLightTheme,
  [BuiltinThemeType.SemiThemeDark]: semiDesignDarkTheme,
  [BuiltinThemeType.ArcoThemeLight]: arcoDesignLightTheme,
  [BuiltinThemeType.ArcoThemeDark]: arcoDesignDarkTheme,
  [BuiltinThemeType.VeOThemeLight]: veODesignLightTheme,
  [BuiltinThemeType.VeOThemeFinanceLight]: veODesignLightFinanceTheme,
  [BuiltinThemeType.VeOThemeGovernmentLight]: veODesignLightGovernmentTheme,
  [BuiltinThemeType.VeOThemeConsumerLight]: veODesignLightConsumerTheme,
  [BuiltinThemeType.VeOThemeAutomobileLight]: veODesignLightAutomobileTheme,
  [BuiltinThemeType.VeOThemeCulturalTourismLight]: veODesignLightCulturalTourismTheme,
  [BuiltinThemeType.VeOThemeMedicalLight]: veODesignLightMedicalTheme,
  [BuiltinThemeType.VeOThemeNewEnergyLight]: veODesignLightNewEnergyTheme,
  [BuiltinThemeType.VeOThemeDark]: veODesignDarkTheme,
  [BuiltinThemeType.VeOThemeFinanceDark]: veODesignDarkFinanceTheme,
  [BuiltinThemeType.VeOThemeGovernmentDark]: veODesignDarkGovernmentTheme,
  [BuiltinThemeType.VeOThemeConsumerDark]: veODesignDarkConsumerTheme,
  [BuiltinThemeType.VeOThemeAutomobileDark]: veODesignDarkAutomobileTheme,
  [BuiltinThemeType.VeOThemeCulturalTourismDark]: veODesignDarkCulturalTourismTheme,
  [BuiltinThemeType.VeOThemeMedicalDark]: veODesignDarkMedicalTheme,
  [BuiltinThemeType.VeOThemeNewEnergyDark]: veODesignDarkNewEnergyTheme
};
