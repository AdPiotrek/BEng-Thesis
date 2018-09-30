import { AuthorizedModule } from './authorized.module';

describe('AuthorizedModule', () => {
  let authorizedModule: AuthorizedModule;

  beforeEach(() => {
    authorizedModule = new AuthorizedModule();
  });

  it('should create an instance', () => {
    expect(authorizedModule).toBeTruthy();
  });
});
