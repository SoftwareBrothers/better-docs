/**
 * Definition of abstract class
 */
abstract class AbstractClass {
  /**
   * Some property
   */
  someProperty: number;

  /**
   * Abstract property
   */
  abstract someAbstractProperty: string;

  /**
   * Some function
   */
  public someFunction(): void;

  /**
   * Abstract function
   */
  abstract someAbstractFunction(param?: string): string | void;

  #test: string
}
