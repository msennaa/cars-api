import Account from '../../src/domain/entity/Account';

test('Should create an account with plain password ', function () {
    const account = Account.create('any name', 'any_email@mail.com', '97456321558', 'AAA9999', false, true, '123456', 'plain');
    expect(account.verifyPassword('123456')).toBe(true);
})

test('Should create an account with md5 password', function () {
    const account = Account.create('any name', 'any_email@mail.com', '97456321558', 'AAA9999', false, true, '123456', 'md5');
    expect(account.verifyPassword('123456')).toBe(true);
})

test('Should create an account with sha1 password', function () {
    const account = Account.create('any name', 'any_email@mail.com', '97456321558', 'AAA9999', false, true, '123456', 'sha1');
    expect(account.verifyPassword('123456')).toBe(true);
})
